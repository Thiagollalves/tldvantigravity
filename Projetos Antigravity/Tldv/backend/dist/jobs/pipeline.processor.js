"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../common/storage.service");
const ai_service_1 = require("../ai/ai.service");
const client_1 = require("@prisma/client");
let PipelineProcessor = class PipelineProcessor extends bullmq_1.WorkerHost {
    prisma;
    storage;
    ai;
    pipelineQueue;
    constructor(prisma, storage, ai, pipelineQueue) {
        super();
        this.prisma = prisma;
        this.storage = storage;
        this.ai = ai;
        this.pipelineQueue = pipelineQueue;
    }
    async process(job) {
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
                    throw new Error(`Unknown step: ${step}`);
            }
        }
        catch (error) {
            await this.prisma.meeting.update({
                where: { id: meetingId },
                data: {
                    status: client_1.MeetingStatus.FAILED,
                    failureReason: (error instanceof Error ? error.message : 'Unknown error') ||
                        'Internal error',
                },
            });
            throw error;
        }
    }
    async handleAudioExtraction(job) {
        const { meetingId } = job.data;
        await this.updateStatus(meetingId, client_1.MeetingStatus.AUDIO_EXTRACTING);
        const meeting = await this.prisma.meeting.findUnique({
            where: { id: meetingId },
            include: { mediaAssets: true },
        });
        if (!meeting)
            throw new Error('Meeting not found');
        const videoAsset = meeting.mediaAssets.find((a) => a.mime.startsWith('video/'));
        if (!videoAsset) {
            return this.addToQueue(job, 'TRANSCRIBE');
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await this.updateStatus(meetingId, client_1.MeetingStatus.AUDIO_EXTRACTED);
        return this.addToQueue(job, 'TRANSCRIBE');
    }
    async handleTranscription(job) {
        const { meetingId } = job.data;
        await this.updateStatus(meetingId, client_1.MeetingStatus.TRANSCRIBING);
        const mockFullText = 'Esta é uma transcrição de exemplo da reunião de kickoff...';
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
        await this.updateStatus(meetingId, client_1.MeetingStatus.TRANSCRIBED);
        return this.addToQueue(job, 'SUMMARIZE');
    }
    async handleSummarization(job) {
        const { meetingId } = job.data;
        await this.updateStatus(meetingId, client_1.MeetingStatus.SUMMARIZING);
        const meeting = await this.prisma.meeting.findUnique({
            where: { id: meetingId },
            include: { transcript: true },
        });
        if (!meeting || !meeting.transcript) {
            throw new Error('Transcript not found for summarization');
        }
        const analysis = await this.ai.summarize(meeting.transcript.fullText, meeting.template);
        await this.prisma.$transaction([
            this.prisma.summaryVersion.create({
                data: {
                    meetingId,
                    version: 1,
                    template: meeting.template,
                    model: 'gemini-1.5-flash',
                    summaryJson: analysis,
                },
            }),
            ...analysis.next_steps.map((step) => this.prisma.task.create({
                data: {
                    meetingId,
                    text: step.text,
                    owner: step.owner,
                    dueDate: step.due_date ? new Date(step.due_date) : null,
                },
            })),
            ...analysis.decisions.map((d) => this.prisma.decision.create({
                data: {
                    meetingId,
                    text: d.text,
                    owner: d.owner,
                },
            })),
        ]);
        await this.updateStatus(meetingId, client_1.MeetingStatus.READY);
    }
    async updateStatus(id, status) {
        await this.prisma.meeting.update({ where: { id }, data: { status } });
    }
    async addToQueue(job, step) {
        await this.pipelineQueue.add('process-meeting', {
            meetingId: job.data.meetingId,
            step,
        });
    }
};
exports.PipelineProcessor = PipelineProcessor;
exports.PipelineProcessor = PipelineProcessor = __decorate([
    (0, bullmq_1.Processor)('meeting-pipeline'),
    __param(3, (0, bullmq_1.InjectQueue)('meeting-pipeline')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService,
        ai_service_1.AIService,
        bullmq_2.Queue])
], PipelineProcessor);
//# sourceMappingURL=pipeline.processor.js.map