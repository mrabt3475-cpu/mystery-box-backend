import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('subscription')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  async getSubscription(@Request() req) {
    return this.subscriptionService.getSubscription(req.user.id);
  }

  @Get('benefits')
  async getBenefits(@Request() req) {
    return this.subscriptionService.getBenefits(req.user.id);
  }

  @Get('status')
  async checkStatus(@Request() req) {
    const isVIP = await this.subscriptionService.checkVIPStatus(req.user.id);
    return { isVIP };
  }

  @Post('upgrade')
  async upgrade(@Request() req, @Body('months') months: number) {
    return this.subscriptionService.upgradeToVIP(req.user.id, months || 1);
  }
}
