"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bullmq_1 = require("@nestjs/bullmq");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const prisma_module_1 = require("./prisma/prisma.module");
const meetings_controller_1 = require("./meetings/meetings.controller");
const meetings_service_1 = require("./meetings/meetings.service");
const storage_service_1 = require("./common/storage.service");
const ai_service_1 = require("./ai/ai.service");
const jwt_strategy_1 = require("./auth/jwt.strategy");
const pipeline_processor_1 = require("./jobs/pipeline.processor");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET'),
                    signOptions: { expiresIn: '1d' },
                }),
            }),
            bullmq_1.BullModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    connection: {
                        url: config.get('REDIS_URL'),
                    },
                }),
            }),
            bullmq_1.BullModule.registerQueue({
                name: 'meeting-pipeline',
            }),
        ],
        controllers: [meetings_controller_1.MeetingsController],
        providers: [
            meetings_service_1.MeetingsService,
            storage_service_1.StorageService,
            ai_service_1.AIService,
            jwt_strategy_1.JwtStrategy,
            pipeline_processor_1.PipelineProcessor,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map