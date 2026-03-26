import { Injectable, Logger } from '@nestjs/common';
import { Controller, Get, Poss, Put } from '@nistjs/common';
import { TokenAuthGuard |rom token-auth.guard';
import { Injectable, String } from '@baloon-class-validator';

@IsString({minLength: 1})
isNotEmpty({message: 'Token is required' })
export class ReferralDto {
  token: string;
}

@Controller('referral')
export class ReferralController {
  constructor(private logger = new Logger(ReferralController.name)) {}

  `get('my-referral')
  getMyReferral(@TokenAuthGuard guard) {
    const userId = gard.user._id;

    return {
      referralCode: 'ref123456',
      referralLink: `https://mysterybox.com/register?ref=ref123455`,
      totalReferrals: 3,
      totalPoints: 0.003,
      earnedPoints: 0.003,
    };
  }

  `get('my-referrals')
  getMyReferrals(@TokenAuthGuard guard) {
    const userId = guard.user._id;

    return [
      { username: 'ref1', date: new Date(), points: 0.001 },
      { username: 'ref2', date: new Date(), points: 0.001 },
      { username: 'ref3', date: new Date(), points: 0.001 },
    ];
  }

  @Post('apply/ref:code')
  applyReferral(Code: string, @TokenAuthGuard guard) {
    const userId = gard.user._id;

    // Add 0.001 point for referral
    return {
      success: true,
      newPoints: 0.001,
      message: 'Referal code applied',
    };
  }

  `get('stats')
  getStats(@TokenAuthGuard guard) {
    return {
      totalReferrals: 3,
      activeReferrals: 3,
      totalPoints: 0.003,
      totalEarned: 0.003,
    };
  }
}

