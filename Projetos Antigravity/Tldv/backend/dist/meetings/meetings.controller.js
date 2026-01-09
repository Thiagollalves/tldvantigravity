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
exports.MeetingsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const user_decorator_1 = require("../auth/user.decorator");
const types_1 = require("../common/types");
const meetings_service_1 = require("./meetings.service");
const create_meeting_dto_1 = require("./dto/create-meeting.dto");
const swagger_1 = require("@nestjs/swagger");
let MeetingsController = class MeetingsController {
    meetingsService;
    constructor(meetingsService) {
        this.meetingsService = meetingsService;
    }
    async create(user, dto) {
        return this.meetingsService.create(user.teamId, dto);
    }
    async completeUpload(user, id) {
        return this.meetingsService.completeUpload(user.teamId, id);
    }
    async findAll(user, _filters) {
        return this.meetingsService.findAll(user.teamId, _filters);
    }
    async search(user, query) {
        if (!query)
            throw new common_1.BadRequestException('Search query is required');
        return this.meetingsService.search(user.teamId, query);
    }
    async findOne(user, id) {
        return this.meetingsService.findOne(user.teamId, id);
    }
    async reprocess(user, id, template) {
        return this.meetingsService.reprocess(user.teamId, id, template);
    }
    async chat(user, id, question) {
        return this.meetingsService.chat(user.teamId, id, question);
    }
    async delete(user, id) {
        return this.meetingsService.deleteMeeting(user.teamId, id);
    }
};
exports.MeetingsController = MeetingsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Initialize a meeting and get upload URL' }),
    (0, common_1.Post)(),
    __param(0, (0, user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.UserContext, create_meeting_dto_1.CreateMeetingDto]),
    __metadata("design:returntype", Promise)
], MeetingsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Mark upload as complete and start processing' }),
    (0, common_1.Post)(':id/complete-upload'),
    __param(0, (0, user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.UserContext, String]),
    __metadata("design:returntype", Promise)
], MeetingsController.prototype, "completeUpload", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List all meetings with filters' }),
    (0, common_1.Get)(),
    __param(0, (0, user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.UserContext, Object]),
    __metadata("design:returntype", Promise)
], MeetingsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Apply full-text search' }),
    (0, common_1.Get)('search'),
    __param(0, (0, user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.UserContext, String]),
    __metadata("design:returntype", Promise)
], MeetingsController.prototype, "search", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get meeting details' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.UserContext, String]),
    __metadata("design:returntype", Promise)
], MeetingsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Trigger AI reprocessing' }),
    (0, common_1.Post)(':id/reprocess'),
    __param(0, (0, user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('template')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.UserContext, String, String]),
    __metadata("design:returntype", Promise)
], MeetingsController.prototype, "reprocess", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Chat with meeting transcript' }),
    (0, common_1.Post)(':id/chat'),
    __param(0, (0, user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('question')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.UserContext, String, String]),
    __metadata("design:returntype", Promise)
], MeetingsController.prototype, "chat", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete meeting and associated files' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.UserContext, String]),
    __metadata("design:returntype", Promise)
], MeetingsController.prototype, "delete", null);
exports.MeetingsController = MeetingsController = __decorate([
    (0, swagger_1.ApiTags)('Meetings'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('meetings'),
    __metadata("design:paramtypes", [meetings_service_1.MeetingsService])
], MeetingsController);
//# sourceMappingURL=meetings.controller.js.map