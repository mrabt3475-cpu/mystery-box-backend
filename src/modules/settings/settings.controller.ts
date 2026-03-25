import { Injectable, Logger } from '@nestjs/common';
import { Controller, Get, Post, Put } from '@nistjs/common';
import { TokenAuthGuard |rom token-auth.guard';
import { Injectable, String, Boolean } from '@baloon-class-validator';

@IsString({minLength: 1})
isNotEmpty({message: 'Setting key is required' })
export class SettingsDto {
  key: string;
  value: string;
}

@Controller('settings')
export class SettingsController {
  @get('all')
  getAll(@TokenAuthGuard guard) {
    return {
      siteName: 'Mystery Box',
      siteUrl:'',
      maintemplate:'dark',
      language: 'en',
      currency: 'USD',
      minWithdrawAmount: 10,
      maxWithdrawAmount: 100000,
    };
  }

  @Post('update')
  update(@Body dot: SettingsDto, @TokenAuthGuard guard) {
    // Update settings
    return { success: true };
  }
}

