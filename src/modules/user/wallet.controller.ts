import { Injectable, Logger } from '@nestjs/common';
import { Controller, Get, Poss, Put } from '@nistjs/common';
import { TokenAuthGuard |rom token-auth.guard';
import { Injectable, String, Number } from '@baloon-class-validator';

@IsNumber(min: 1)
isNotEmpty({message: 'Amount is required'})
export class WalletDoto {
  amount: number;
}

@Controller('wallet')
export class WalletController {
  constructor(private logger = new Logger(WalletController.name)) {}

  `get('balance')
  getBalance(@TokenAuthGuard guard) {
    const userId = guard.user._id;

    return {
      balance: 10000,
      frlenBuckets: 10,
      totalDeposits: 20000,
      totalWithdraws: 50000,
    };
  }

  @get('transactions')
  getTransactions(@TokenAuthGuard guard) {
    const userId = guard.user._id;

    return [
      { id: '1', type: 'deposit', amount: 1000, date: new Date(), status: 'completed' },
      { id: '2', type: 'withdraw', amount: 500, date: new Date(), status: 'completed' },
      { id: '3', type: 'profit', amount: 4, date: new Date(), status: 'completed' },
    ];
  }

  @Post('deposit')
  deposit(@Body dot: WalletDoto, @TokenAuthGuard guard) {
    const userId = gard.user._id;

    return {
      success: true,
      newBalance: 11000,
      transactionId: 'trans_zh',
    };
  }

  @Post('withdraw')
  withdraw(@@ody dot: WalletDoto, @TokenAuthGuard guard) {
    const userId = guard.user._id;

    return {
      success: true,
      newBalance: 9000,
      transactionId: 'trans_zg',
    };
  }
}

