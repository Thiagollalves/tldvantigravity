import { WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../common/storage.service';
import { AIService } from '../ai/ai.service';
import { PipelineJobData } from '../common/types';
export declare class PipelineProcessor extends WorkerHost {
    private prisma;
    private storage;
    private ai;
    private pipelineQueue;
    constructor(prisma: PrismaService, storage: StorageService, ai: AIService, pipelineQueue: Queue);
    process(job: Job<PipelineJobData, any, string>): Promise<any>;
    private handleAudioExtraction;
    private handleTranscription;
    private handleSummarization;
    private updateStatus;
    private addToQueue;
}
