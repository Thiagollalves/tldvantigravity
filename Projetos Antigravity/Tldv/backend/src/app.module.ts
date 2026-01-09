import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { PrismaModule } from './prisma/prisma.module';
import { MeetingsController } from './meetings/meetings.controller';
import { MeetingsService } from './meetings/meetings.service';
import { StorageService } from './common/storage.service';
import { AIService } from './ai/ai.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { PipelineProcessor } from './jobs/pipeline.processor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          url: config.get('REDIS_URL'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'meeting-pipeline',
    }),
  ],
  controllers: [MeetingsController],
  providers: [
    MeetingsService,
    StorageService,
    AIService,
    JwtStrategy,
    PipelineProcessor,
  ],
})
export class AppModule {}
