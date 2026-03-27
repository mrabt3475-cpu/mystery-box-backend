import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('rewards')
@UseGuards(JwtAuthGuard)
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  async getRewards(@Request() req) {
    return this.rewardsService.getUserRewards(req.user.userId);
  }

  @Get('unclaimed')
  async getUnclaimed(@Request() req) {
    return this.rewardsService.getUnclaimedRewards(req.user.userId);
  }

  @Post(':id/claim')
  async claimReward(@Request() req, @Param('id') id: string) {
    return this.rewardsService.claimReward(id, req.user.userId);
  }

  @Get('total-winnings')
  async getTotalWinnings(@Request() req) {
    return { total: await this.rewardsService.getTotalWinnings(req.user.userId) };
  }
}
