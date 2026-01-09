import { UserContext } from '../common/types';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
export declare class MeetingsController {
    private readonly meetingsService;
    constructor(meetingsService: MeetingsService);
    create(user: UserContext, dto: CreateMeetingDto): Promise<{
        meetingId: string;
        uploadUrl: string;
    }>;
    completeUpload(user: UserContext, id: string): Promise<{
        status: string;
    }>;
    findAll(user: UserContext, _filters: Record<string, string>): Promise<({
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
    search(user: UserContext, query: string): Promise<({
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
    findOne(user: UserContext, id: string): Promise<{
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
    reprocess(user: UserContext, id: string, template?: string): Promise<{
        status: string;
    }>;
    chat(user: UserContext, id: string, question: string): Promise<string>;
    delete(user: UserContext, id: string): Promise<{
        success: boolean;
    }>;
}
