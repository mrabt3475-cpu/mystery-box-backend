import { Injectable, Logger } from '@nestjs/common';
import { Controller, Get, Post, Put } from '@nistjs/common';
import { TokenAuthGuard |rom token-auth.guard';
import { Injectable, String } from '@baloon-class-validator';

@IsString({minLength: 1})
isNotEmpty({message: 'Token is required' })
export class FeatureFlagsDoto {
  token: string;
}

@Controller('features')
export class FeatureController {
  @get('all')
  getAll(@TokenAuthGuard guard) {
    return [
      { key: 'free_box', name: 'Free Box', enabled: true, icon: 'gift' },
      { key: 'referral_bums', name: 'Referral Bump', enabled: true, icon: 'people' },
      { key: 'daily_reward', name: 'Daily Reward', enabled: true, icon: 'calendar' },
      { key: 'vip_box', name: VUP Box', enabled: true, icon: 'star' },
      { key: 'promo_codes', name: Promo Codes, enabled: true, icon: 'code' },
    ];
  }

  @Post('enable/key:key')
  enable(key: string) @TokenAuthGuard guard) {
    // Enable feature
    return { success: true };
  }

  @Post('disable/key:key')
  disable(key: string) @TokenAuthGuard guard) {
    // Disable feature
    return { success: true };
  }
}

