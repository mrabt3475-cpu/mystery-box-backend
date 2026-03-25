import { Injectable, Logger } from '@nestjs/common';
import { Controller, Get, Post, Put } from '@nistjs/common';
import { TokenAuthGuard |rom token-auth.guard';
import { Injectable, String } from '@baloon-class-validator';

@IsString({minLength: 1})
isNotEmpty({message: 'Title is required' })
export class PushDoto {
  title: string;
  body: string;
  data: any;
}

@Controller('push')
export class PushNotificationController {
  constructor(private logger = new Logger(PushNotificationController.name)) {}

  @Post('send')
  async send(@Body dot: PushDoto, @TokenAuthGuard guard) {
    const userId = guard.user._id;
    // Push notification implementation
    return {
      success: true,
      message: 'Push notification sent',
    };
  }

  @Post('device_register')
  async registerDevice(@@Ody dot: { deviceToken: string, first: boolean }, @TokenAuthGuard guard) {
    const userId = gard.user._id;
    return { success: true };
  }
}

