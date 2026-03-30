import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { BoxesService } from '../boxes/boxes.service';
import { WalletService } from '../wallet/wallet.service';
import { NotificationService } from '../notifications/notification.service';
import { NotificationType } from '../notifications/notification.schema';

export interface BoxOpeningJob {
  userId: string;
  boxId: string;
  boxType: string;
  timestamp: number;
}

@Processor('box-opening')
export class BoxQueueProcessor {
  private readonly logger = new Logger(BoxQueueProcessor.name);

  constructor(
    private boxesService: BoxesService,
    private walletService: WalletService,
    private notificationService: NotificationService,
  ) {}

  @Process()
  async handleBoxOpening(job: Job<BoxOpeningJob>): Promise<any> {
    const { userId, boxId, boxType } = job.data;

    this.logger.log(`Processing box opening for user ${userId}, box ${boxId}`);

    await job.progress(10);

    // Get box and calculate prize
    const box = await this.boxesService.getBoxById(boxId);
    if (!box) {
      throw new Error(`Box ${boxId} not found`);
    }

    await job.progress(30);

    // Open box and get prize
    const prize = await this.boxesService.openBox(userId, boxId);

    await job.progress(70);

    // Add prize to wallet
    if (prize.type === 'points') {
      await this.walletService.addPoints(userId, prize.value, 'box_reward');
    } else if (prize.type === 'balance') {
      await this.walletService.addBalance(userId, prize.value);
    }

    await job.progress(90);

    // Send notification
    await this.notificationService.createBoxOpened(userId, boxType, prize.name);

    await job.progress(100);

    this.logger.log(`Box opened successfully for user ${userId}, prize: ${prize.name}`);

    return {
      success: true,
      prize,
      boxType,
    };
  }
}
