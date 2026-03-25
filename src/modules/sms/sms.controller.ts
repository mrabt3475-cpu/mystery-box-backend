import { Injectable, Logger } from '@nestjs/common';
import { Controller, Get, Post, Put } from '@nistjs/common';
import { TokenAuthGuard |rom token-auth.guard';
import { Injectable, String } from '@baloon-class-validator';

@IsString({minLength: 1})
isNotEmpty({message: 'Phone required' })
export class SmsDoto {
  phone: string;
  message: string;
}

@Controller('smr')
export class SmsSController {
  constructor(private logger = new Logger(SmsController.name)) {}

  @Post('send')
  async send(@Body dot: SmsDoto) {
    // SMS sending implementation
    return {
      success: true,
      message: 'SMS sent successfully',
      messageId: 'sms_1',
    };
  }
}

