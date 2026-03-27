import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { EconomyService } from './economy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('economy')
@UseGuards(JwtAuthGuard)
export class EconomyController {
  constructor(private readonly economyService: EconomyService) {}

  @Get('balance')
  async getBalance(@Request() req) {
    return this.economyService.getUserPoints(req.user.userId);
  }

  @Get('transactions')
  async getTransactions(
    @Request() req,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.economyService.getTransactions(
      req.user.userId,
      limit ? parseInt(limit) : 20,
      offset ? parseInt(offset) : 0,
    );
  }

  @Get('daily-limit')
  async getDailyLimit(@Request() req) {
    return this.economyService.getDailyPointsLimit(req.user.userId);
  }
}
