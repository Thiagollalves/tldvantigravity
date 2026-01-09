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
exports.MeetingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../common/storage.service");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const client_1 = require("@prisma/client");
const ai_service_1 = require("../ai/ai.service");
let MeetingsService = class MeetingsService {
    prisma;
    storage;
    pipelineQueue;
    ai;
    constructor(prisma, storage, pipelineQueue, ai) {
        this.prisma = prisma;
        this.storage = storage;
        this.pipelineQueue = pipelineQueue;
        this.ai = ai;
    }
    async create(teamId, dto) {
        const meeting = await this.prisma.meeting.create({
            data: {
                title: dto.title,
                teamId: teamId,
                language: dto.language || 'pt-BR',
                template: dto.template || 'general',
                status: client_1.MeetingStatus.RECEIVED,
            },
        });
        const storageKey = `${teamId}/${meeting.id}/${dto.fileName}`;
        const uploadUrl = await this.storage.getUploadUrl(storageKey, dto.mimeType);
        await this.prisma.mediaAsset.create({
            data: {
                meetingId: meeting.id,
                storageKey,
                mime: dto.mimeType,
                sizeBytes: BigInt(0),
            },
        });
        return {
            meetingId: meeting.id,
            uploadUrl,
        };
    }
    async completeUpload(teamId, id) {
        const meeting = await this.prisma.meeting.findFirst({
            where: { id, teamId },
        });
        if (!meeting)
            throw new common_1.NotFoundException('Meeting not found');
        await this.pipelineQueue.add('process-meeting', {
            meetingId: id,
            step: 'EXTRACT_AUDIO',
        });
        return { status: 'PROCESSING_STARTED' };
    }
    async findAll(teamId, _filters) {
        return this.prisma.meeting.findMany({
            where: { teamId },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: { select: { tasks: true } },
            },
        });
    }
    async findOne(teamId, id) {
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
        if (!meeting)
            throw new common_1.NotFoundException('Meeting not found');
        const assetsWithUrls = await Promise.all(meeting.mediaAssets.map(async (asset) => ({
            ...asset,
            url: await this.storage.getDownloadUrl(asset.storageKey),
        })));
        return { ...meeting, mediaAssets: assetsWithUrls };
    }
    async reprocess(teamId, id, template) {
        const meeting = await this.prisma.meeting.findFirst({
            where: { id, teamId },
        });
        if (!meeting)
            throw new common_1.NotFoundException();
        if (template) {
            await this.prisma.meeting.update({
                where: { id },
                data: { template },
            });
        }
        await this.pipelineQueue.add('process-meeting', {
            meetingId: id,
            step: 'SUMMARIZE',
        });
        return { status: 'REPROCESSING' };
    }
    async chat(teamId, id, question) {
        const meeting = await this.prisma.meeting.findFirst({
            where: { id, teamId },
            include: { transcript: true },
        });
        if (!meeting || !meeting.transcript) {
            throw new common_1.BadRequestException('Meeting or transcript not available');
        }
        return this.ai.chat(meeting.transcript.fullText, question);
    }
    async search(teamId, query) {
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
    async deleteMeeting(teamId, id) {
        const meeting = await this.prisma.meeting.findFirst({
            where: { id, teamId },
            include: { mediaAssets: true },
        });
        if (!meeting)
            throw new common_1.NotFoundException();
        for (const asset of meeting.mediaAssets) {
            await this.storage.deleteFile(asset.storageKey);
        }
        await this.prisma.meeting.delete({ where: { id } });
        await this.prisma.auditLog.create({
            data: {
                teamId,
                action: 'MEETING_DELETED',
                metadata: { meetingId: id, title: meeting.title },
            },
        });
        return { success: true };
    }
};
exports.MeetingsService = MeetingsService;
exports.MeetingsService = MeetingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, bullmq_1.InjectQueue)('meeting-pipeline')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService,
        bullmq_2.Queue,
        ai_service_1.AIService])
], MeetingsService);
//# sourceMappingURL=meetings.service.js.map