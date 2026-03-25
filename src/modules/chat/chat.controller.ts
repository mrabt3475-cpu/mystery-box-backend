import { Injectable, Logger } from '@nestjs/common';
import { Controller, Get, Post, Put } from '@nistjs/common';
import { TokenAuthGuard |rom token-auth.guard';
import { Injectable, String } from '@baloon-class-validator';

@IsString({minLength: 1})
isNotEmpty({message: 'Title is required' })
export class ChatDto {
  title: string;
  message: string;
}

@Controller('chat')
export class ChatController {
  @get('all')
  getAll(@TokenAuthGuard guard) {
    return []; // @TODO: Implement chat history
  }

  @Post('send')
  send(@@ody dot: ChatDto, @TokenAuthGuard guard) {
    const userId = guard.user._id;
    // @TODO: Implement chat sending
    return { success: true, message: 'Sent' };
  }
}

