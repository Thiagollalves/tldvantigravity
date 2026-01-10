import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../common/storage.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { MeetingStatus } from '@prisma/client';
import { AIService } from '../ai/ai.service';

@Injectable()
export class MeetingsService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
    @InjectQueue('meeting-pipeline') private pipelineQueue: Queue,
    private ai: AIService,
  ) {}

  async create(teamId: string, dto: CreateMeetingDto) {
    const meeting = await this.prisma.meeting.create({
      data: {
        title: dto.title,
        teamId: teamId,
        language: dto.language || 'pt-BR',
        template: dto.template || 'general',
        status: MeetingStatus.RECEIVED,
      },
    });

    const storageKey = `${teamId}/${meeting.id}/${dto.fileName}`;
    const uploadUrl = await this.storage.getUploadUrl(storageKey, dto.mimeType);

    // Track the asset as pending
    await this.prisma.mediaAsset.create({
      data: {
        meetingId: meeting.id,
        storageKey,
        mime: dto.mimeType,
        sizeBytes: BigInt(0), // Initialized as 0, updated later
      },
    });

    return {
      meetingId: meeting.id,
      uploadUrl,
    };
  }

  async completeUpload(teamId: string, id: string) {
    const meeting = await this.prisma.meeting.findFirst({
      where: { id, teamId },
    });

    if (!meeting) throw new NotFoundException('Meeting not found');

    // Trigger the first job in the pipeline (audio extraction)
    await this.pipelineQueue.add('process-meeting', {
      meetingId: id,
      step: 'EXTRACT_AUDIO',
    });

    return { status: 'PROCESSING_STARTED' };
  }

  async findAll(teamId: string) {
    return this.prisma.meeting.findMany({
      where: { teamId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { tasks: true } },
      },
    });
  }

  async findOne(teamId: string, id: string) {
    const meeting = await this.prisma.meeting.findFirst({
      where: { id, teamId },
      include: {
        mediaAssets: true,
        transcript: true,
        summaries: { orderBy: { version: 'desc' }, take: 1 },
        tasks: true,
        decisions: true,
      },
    });

    if (!meeting) throw new NotFoundException('Meeting not found');

    // Add signed URLs for assets
    const assetsWithUrls = await Promise.all(
      meeting.mediaAssets.map(async (asset) => ({
        ...asset,
        url: await this.storage.getDownloadUrl(asset.storageKey),
      })),
    );

    return { ...meeting, mediaAssets: assetsWithUrls };
  }

  async reprocess(teamId: string, id: string, template?: string) {
    const meeting = await this.prisma.meeting.findFirst({
      where: { id, teamId },
    });
    if (!meeting) throw new NotFoundException();

    if (template) {
      await this.prisma.meeting.update({
        where: { id },
        data: { template },
      });
    }

    await this.pipelineQueue.add('process-meeting', {
      meetingId: id,
      step: 'SUMMARIZE', // Can restart from summarization if transcript exists
    });

    return { status: 'REPROCESSING' };
  }

  async chat(teamId: string, id: string, question: string) {
    const meeting = await this.prisma.meeting.findFirst({
      where: { id, teamId },
      include: { transcript: true },
    });

    if (!meeting || !meeting.transcript) {
      throw new BadRequestException('Meeting or transcript not available');
    }

    return this.ai.chat(meeting.transcript.fullText, question);
  }

  async search(teamId: string, query: string) {
    return this.prisma.meeting.findMany({
      where: {
        teamId,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          {
            transcript: { fullText: { contains: query, mode: 'insensitive' } },
          },
        ],
      },
      include: {
        transcript: {
          select: { segments: true },
        },
      },
    });
  }

  async deleteMeeting(teamId: string, id: string) {
    const meeting = await this.prisma.meeting.findFirst({
      where: { id, teamId },
      include: { mediaAssets: true },
    });

    if (!meeting) throw new NotFoundException();

    // 1. Delete from S3
    for (const asset of meeting.mediaAssets) {
      await this.storage.deleteFile(asset.storageKey);
    }

    // 2. Delete from DB (Cascade handles related records)
    await this.prisma.meeting.delete({ where: { id } });

    // 3. Audit log
    await this.prisma.auditLog.create({
      data: {
        teamId,
        action: 'MEETING_DELETED',
        metadata: { meetingId: id, title: meeting.title },
      },
    });

    return { success: true };
  }
}
