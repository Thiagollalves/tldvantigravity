import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMeetingDto {
  @ApiProperty({ example: 'Sprint Planning Q1' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'meeting-video.mp4' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ example: 'video/mp4' })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiProperty({ example: 'pt-BR', required: false })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty({ example: 'daily', required: false })
  @IsString()
  @IsOptional()
  template?: string;
}
