import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue, Job } from 'bull';
import { BoxOpeningJob } from './box-queue.processor';

@Injectable()
export class BoxQueueService {
  private readonly logger = new Logger(BoxQueueService.name);

  constructor(
    @InjectQueue('box-opening') private boxQueue: Queue<BoxOpeningJob>,
  ) {}

  async addBoxOpeningJob(
    userId: string,
    boxId: string,
    boxType: string,
  ): Promise<Job<BoxOpeningJob>> {
    const job = await this.boxQueue.add(
      {
        userId,
        boxId,
        boxType,
        timestamp: Date.now(),
      },
      {
        priority: 1,
        timeout: 30000, // 30 seconds max
      },
    );

    this.logger.log(`Added box opening job ${job.id} for user ${userId}`);
    return job;
  }

  async getJobStatus(jobId: number): Promise<{
    status: string;
    progress: number;
    result?: any;
    failedReason?: string;
  }> {
    const job = await this.boxQueue.getJob(jobId);
    if (!job) {
      return { status: 'unknown', progress: 0 };
    }

    return {
      status: await job.getState(),
      progress: job.progress(),
      result: job.returnvalue,
      failedReason: job.failedReason,
    };
  }

  async getUserJobs(userId: string, limit: number = 10): Promise<Job<BoxOpeningJob>[]> {
    const jobs = await this.boxQueue.getJobs(['active', 'waiting', 'completed', 'failed']);
    return jobs
      .filter(job => job.data.userId === userId)
      .slice(0, limit);
  }

  async pauseQueue(): Promise<void> {
    await this.boxQueue.pause();
  }

  async resumeQueue(): Promise<void> {
    await this.boxQueue.resume();
  }

  async clearQueue(): Promise<void> {
    await this.boxQueue.empty();
  }

  async getQueueStats(): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  }> {
    const [waiting, active, completed, failed] = await Promise.all([
      this.boxQueue.getWaitingCount(),
      this.boxQueue.getActiveCount(),
      this.boxQueue.getCompletedCount(),
      this.boxQueue.getFailedCount(),
    ]);

    return { waiting, active, completed, failed };
  }
}
