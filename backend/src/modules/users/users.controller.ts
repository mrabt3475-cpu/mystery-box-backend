import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats(@Request() req) {
    return this.usersService.getUserStats(req.user.userId);
  }

  @Get('leaderboard')
  async getLeaderboard(@Query('limit') limit?: string) {
    return this.usersService.getLeaderboard(limit ? parseInt(limit) : 10);
  }

  @UseGuards(JwtAuthGuard)
  @Get('daily-reward')
  async claimDailyReward(@Request() req) {
    const streak = await this.usersService.checkAndUpdateDailyStreak(req.user.userId);
    return { streak, message: `مكافأتك اليومية! سلسلة ${streak} أيام` };
  }
}
