import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../common/storage.service';
import { Queue } from 'bullmq';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { AIService } from '../ai/ai.service';
export declare class MeetingsService {
    private prisma;
    private storage;
    private pipelineQueue;
    private ai;
    constructor(prisma: PrismaService, storage: StorageService, pipelineQueue: Queue, ai: AIService);
    create(teamId: string, dto: CreateMeetingDto): Promise<{
        meetingId: string;
        uploadUrl: string;
    }>;
    completeUpload(teamId: string, id: string): Promise<{
        status: string;
    }>;
    findAll(teamId: string, _filters: Record<string, string>): Promise<({
        _count: {
            tasks: number;
        };
    } & {
        id: string;
        title: string;
        status: import(".prisma/client").$Enums.MeetingStatus;
        language: string;
        template: string;
        startedAt: Date | null;
        endedAt: Date | null;
        teamId: string;
        consentRecordedAt: Date | null;
        consentTextVersion: string | null;
        failureReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(teamId: string, id: string): Promise<{
        mediaAssets: {
            url: string;
            id: string;
            meetingId: string;
            storageKey: string;
            mime: string;
            durationMs: number | null;
            sizeBytes: bigint;
            createdAt: Date;
        }[];
        transcript: {
            id: string;
            meetingId: string;
            fullText: string;
            segments: import(".prisma/client").Prisma.JsonValue;
            language: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        summaries: {
            id: string;
            meetingId: string;
            version: number;
            template: string;
            model: string;
            summaryJson: import(".prisma/client").Prisma.JsonValue;
            createdAt: Date;
        }[];
        tasks: {
            id: string;
            meetingId: string;
            text: string;
            owner: string | null;
            dueDate: Date | null;
            status: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        decisions: {
            id: string;
            meetingId: string;
            text: string;
            owner: string | null;
            createdAt: Date;
        }[];
        id: string;
        title: string;
        status: import(".prisma/client").$Enums.MeetingStatus;
        language: string;
        template: string;
        startedAt: Date | null;
        endedAt: Date | null;
        teamId: string;
        consentRecordedAt: Date | null;
        consentTextVersion: string | null;
        failureReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    reprocess(teamId: string, id: string, template?: string): Promise<{
        status: string;
    }>;
    chat(teamId: string, id: string, question: string): Promise<string>;
    search(teamId: string, query: string): Promise<({
        transcript: {
            segments: import(".prisma/client").Prisma.JsonValue;
        } | null;
    } & {
        id: string;
        title: string;
        status: import(".prisma/client").$Enums.MeetingStatus;
        language: string;
        template: string;
        startedAt: Date | null;
        endedAt: Date | null;
        teamId: string;
        consentRecordedAt: Date | null;
        consentTextVersion: string | null;
        failureReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    deleteMeeting(teamId: string, id: string): Promise<{
        success: boolean;
    }>;
}
