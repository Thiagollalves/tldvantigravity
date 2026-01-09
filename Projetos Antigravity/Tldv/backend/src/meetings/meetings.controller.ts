import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/user.decorator';
import { UserContext } from '../common/types';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Meetings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @ApiOperation({ summary: 'Initialize a meeting and get upload URL' })
  @Post()
  async create(@GetUser() user: UserContext, @Body() dto: CreateMeetingDto) {
    return this.meetingsService.create(user.teamId, dto);
  }

  @ApiOperation({ summary: 'Mark upload as complete and start processing' })
  @Post(':id/complete-upload')
  async completeUpload(@GetUser() user: UserContext, @Param('id') id: string) {
    return this.meetingsService.completeUpload(user.teamId, id);
  }

  @ApiOperation({ summary: 'List all meetings with filters' })
  @Get()
  async findAll(
    @GetUser() user: UserContext,
    @Query() _filters: Record<string, string>,
  ) {
    return this.meetingsService.findAll(user.teamId, _filters);
  }

  @ApiOperation({ summary: 'Apply full-text search' })
  @Get('search')
  async search(@GetUser() user: UserContext, @Query('q') query: string) {
    if (!query) throw new BadRequestException('Search query is required');
    return this.meetingsService.search(user.teamId, query);
  }

  @ApiOperation({ summary: 'Get meeting details' })
  @Get(':id')
  async findOne(@GetUser() user: UserContext, @Param('id') id: string) {
    return this.meetingsService.findOne(user.teamId, id);
  }

  @ApiOperation({ summary: 'Trigger AI reprocessing' })
  @Post(':id/reprocess')
  async reprocess(
    @GetUser() user: UserContext,
    @Param('id') id: string,
    @Body('template') template?: string,
  ) {
    return this.meetingsService.reprocess(user.teamId, id, template);
  }

  @ApiOperation({ summary: 'Chat with meeting transcript' })
  @Post(':id/chat')
  async chat(
    @GetUser() user: UserContext,
    @Param('id') id: string,
    @Body('question') question: string,
  ) {
    return this.meetingsService.chat(user.teamId, id, question);
  }

  @ApiOperation({ summary: 'Delete meeting and associated files' })
  @Delete(':id')
  async delete(@GetUser() user: UserContext, @Param('id') id: string) {
    return this.meetingsService.deleteMeeting(user.teamId, id);
  }
}
