import { Processor, WorkerHost, InjectQueue } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../common/storage.service';
import { AIService } from '../ai/ai.service';
import { MeetingStatus, Prisma } from '@prisma/client';
import { AnalysisResult, PipelineJobData } from '../common/types';

@Processor('meeting-pipeline')
export class PipelineProcessor extends WorkerHost {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
    private ai: AIService,
    @InjectQueue('meeting-pipeline') private pipelineQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<PipelineJobData>): Promise<void> {
    const { meetingId, step } = job.data;

    try {
      switch (step) {
        case 'EXTRACT_AUDIO':
          return await this.handleAudioExtraction(job);
        case 'TRANSCRIBE':
          return await this.handleTranscription(job);
        case 'SUMMARIZE':
          return await this.handleSummarization(job);
        default:
          throw new Error(`Unknown step: ${step as string}`);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.prisma.meeting.update({
        where: { id: meetingId },
        data: {
          status: MeetingStatus.FAILED,
          failureReason: errorMessage,
        },
      });
      throw error;
    }
  }

  private async handleAudioExtraction(job: Job<PipelineJobData>) {
    const { meetingId } = job.data;
    await this.updateStatus(meetingId, MeetingStatus.AUDIO_EXTRACTING);

    const meeting = await this.prisma.meeting.findUnique({
      where: { id: meetingId },
      include: { mediaAssets: true },
    });

    if (!meeting) throw new Error('Meeting not found');
    const videoAsset = meeting.mediaAssets.find((a) =>
      a.mime.startsWith('video/'),
    );

    if (!videoAsset) {
      return this.addToQueue(job, 'TRANSCRIBE');
    }

    // Simulating ffmpeg processing...
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await this.updateStatus(meetingId, MeetingStatus.AUDIO_EXTRACTED);
    return this.addToQueue(job, 'TRANSCRIBE');
  }

  private async handleTranscription(job: Job<PipelineJobData>) {
    const { meetingId } = job.data;
    await this.updateStatus(meetingId, MeetingStatus.TRANSCRIBING);

    // Simulate Whisper Integration
    const mockFullText =
      'Esta é uma transcrição de exemplo da reunião de kickoff...';
    const mockSegments = [
      {
        start_ms: 0,
        end_ms: 5000,
        speaker: 'Speaker 1',
        text: 'Welcome everyone.',
      },
      {
        start_ms: 5000,
        end_ms: 10000,
        speaker: 'Speaker 2',
        text: 'Glad to be here.',
      },
    ];

    await this.prisma.transcript.upsert({
      where: { meetingId },
      create: {
        meetingId,
        fullText: mockFullText,
        segments: mockSegments,
        language: 'pt-BR',
      },
      update: {
        fullText: mockFullText,
        segments: mockSegments,
      },
    });

    await this.updateStatus(meetingId, MeetingStatus.TRANSCRIBED);
    return this.addToQueue(job, 'SUMMARIZE');
  }

  private async handleSummarization(job: Job<PipelineJobData>) {
    const { meetingId } = job.data;
    await this.updateStatus(meetingId, MeetingStatus.SUMMARIZING);

    const meeting = await this.prisma.meeting.findUnique({
      where: { id: meetingId },
      include: { transcript: true },
    });

    if (!meeting || !meeting.transcript) {
      throw new Error('Transcript not found for summarization');
    }

    const analysis: AnalysisResult = await this.ai.summarize(
      meeting.transcript.fullText,
      meeting.template,
    );

    await this.prisma.$transaction([
      this.prisma.summaryVersion.create({
        data: {
          meetingId,
          version: 1,
          template: meeting.template,
          model: 'gemini-1.5-flash',
          summaryJson: analysis as unknown as Prisma.InputJsonValue,
        },
      }),
      ...analysis.next_steps.map((step) =>
        this.prisma.task.create({
          data: {
            meetingId,
            text: step.text,
            owner: step.owner,
            dueDate: step.due_date ? new Date(step.due_date) : null,
          },
        }),
      ),
      ...analysis.decisions.map((d) =>
        this.prisma.decision.create({
          data: {
            meetingId,
            text: d.text,
            owner: d.owner,
          },
        }),
      ),
    ]);

    await this.updateStatus(meetingId, MeetingStatus.READY);
  }

  private async updateStatus(id: string, status: MeetingStatus) {
    await this.prisma.meeting.update({ where: { id }, data: { status } });
  }

  private async addToQueue(
    job: Job<PipelineJobData>,
    step: PipelineJobData['step'],
  ) {
    await this.pipelineQueue.add('process-meeting', {
      meetingId: job.data.meetingId,
      step,
    });
  }
}
