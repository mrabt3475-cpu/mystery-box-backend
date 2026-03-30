import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('referral')
@UseGuards(JwtAuthGuard)
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Get('stats')
  async getStats(@Request() req) {
    return this.referralService.getReferralStats(req.user.id);
  }

  @Get('list')
  async getReferrals(@Request() req) {
    return this.referralService.getReferrals(req.user.id);
  }

  @Post('claim')
  async claimBonus(@Request() req) {
    await this.referralService.claimBonus(req.user.id);
    return { success: true, message: 'Bonus claimed successfully' };
  }

  @Get('code/:code')
  async verifyCode(@Param('code') code: string) {
    const referral = await this.referralService.findByCode(code);
    return { valid: !!referral };
  }
}
