import { Controller, Get, Post, Param, Query, UseGuards, Request } from '@nestjs/common';
import { BoxQueueService } from './box-queue.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('queue')
@UseGuards(JwtAuthGuard)
export class QueueController {
  constructor(private readonly boxQueueService: BoxQueueService) {}

  @Get('stats')
  async getQueueStats() {
    return this.boxQueueService.getQueueStats();
  }

  @Get('jobs')
  async getUserJobs(@Request() req, @Query('limit') limit?: number) {
    return this.boxQueueService.getUserJobs(req.user.id, limit ? parseInt(limit.toString()) : 10);
  }

  @Get('job/:id')
  async getJobStatus(@Param('id') id: string) {
    return this.boxQueueService.getJobStatus(parseInt(id));
  }

  @Post('pause')
  async pauseQueue() {
    await this.boxQueueService.pauseQueue();
    return { success: true, message: 'Queue paused' };
  }

  @Post('resume')
  async resumeQueue() {
    await this.boxQueueService.resumeQueue();
    return { success: true, message: 'Queue resumed' };
  }

  @Post('clear')
  async clearQueue() {
    await this.boxQueueService.clearQueue();
    return { success: true, message: 'Queue cleared' };
  }
}
