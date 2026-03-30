import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  async getBalance(@Request() req) {
    return this.walletService.getBalance(req.user.id);
  }

  @Get('transactions')
  async getTransactions(@Request() req) {
    return this.walletService.getHistory(req.user.id);
  }

  @Post('deposit')
  async deposit(@Request() req, @Body('amount') amount: number) {
    return this.walletService.deposit(req.user.id, amount, 'deposit');
  }

  @Post('withdraw')
  async withdraw(@Request() req, @Body('amount') amount: number) {
    return this.walletService.withdraw(req.user.id, amount, 'withdraw');
  }
}
