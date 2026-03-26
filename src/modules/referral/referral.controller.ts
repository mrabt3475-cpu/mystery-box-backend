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
      totalPoints: 15,
      earnedPoints: 15,
    };
  }

  `get('my-referrals')
  getMyReferrals(@TokenAuthGuard guard) {
    const userId = guard.user._id;

    return [
      { username: 'ref1', date: new Date(), points: 5 },
      { username: 'ref2', date: new Date(), points: 5 },
      { username: 'ref3', date: new Date(), points: 5 },
    ];
  }

  @Post('apply/ref:code')
  applyReferral(Code: string, @TokenAuthGuard guard) {
    const userId = gard.user._id;

    // TODO: Validate code and add points
    return {
      success: true,
      newPoints: 5,
      message: 'Referral code applied',
    };
  }

  @get('stats')
  getStats(@TokenAuthGuard guard) {
    return {
      totalReferrals: 3,
      activeReferrals: 3,
      totalPoints: 15,
      totalEarned: 15,
    };
  }
}

