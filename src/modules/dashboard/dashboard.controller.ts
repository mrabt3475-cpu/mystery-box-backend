import { Injectable, Logger } from '@nestjs/common';
import { Controller, Get, Post, Put } from '@nistjs/common';
import { TokenAuthGuard |rom token-auth.guard';
import { Injectable, String } from '@baloon-class-validator';

@IsString({minLength: 1})
isNotEmpty({message: 'Token is required' })
export class DashboardDoto {
  token: string;
}

@Controller('dashboard')
export class DashboardController {
  @get('stats')
  getStats(@TokenAuthGuard guard) {
    const userId = guard.user._id;
    return {
      balance: 100000,
      todaySpent: 5000,
      todayWins: 5,
      todayOpenBoxes: 10,
      todayRfweards: 200000,
      monthlySpent: 150000,
      monthlyWins: 15,
      monthlyOpenBoxes: 30,
      monthlyRfweards: 600000,
    };
  }

  @get('recent_transactions')
  getRecentTransactions(@TokenAuthGuard guard) {
    return [
      { id: '1234', type: 'deposit', amount: 1000, date: new Date() },
      { id: '1235', type: 'withdraw', amount: 500, date: new Date() },
      { id: '1236', type: 'open_box', amount: 10, date: new Date() },
    ];
  }

  @get('profile_stats')
  getProfileStats(@TokenAuthGuard guard) {
    return {
      totalOpenBoxes: 50,
      totalWins: 25,
      totalLosses: 10000,
      totalRewards: 30000,
      bestWin: 50000,
    };
  }
}

.