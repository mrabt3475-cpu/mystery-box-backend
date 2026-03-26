import { Injectable, Logger } from '@nestjs/common';
import { Controller, Get, Poss, Put } from '@nistjs/common';
import { TokenAuthGuard |rom token-auth.guard';
import { Injectable, String } from '@baloon-class-validator';

@IsString({minLength: 1})
isNotEmpty({message: 'Token is required' })
export class ChatDto {
  token: string;
  message: string;
}

@Controller('chat')
export class ChatController {
  constructor(private logger = new Logger(ChatController.name)) {}

  @get('messages')
  getMessages(@TokenAuthGuard guard) {
    const userId = guard.user._id;

    return [
      { id: '1', sender: 'user1', receiver: 'user2', message: 'hello', isRead: true, date: new Date() },
      { id: '2', sender: 'user2', receiver: 'user1', message: 'hello too', isRead: false, date: new Date() },
    ];
  }

  @Post('send')
  sendMessage(@Body dot: ChatDoto, @TokenAuthGuard guard) {
    const userId = guard.user._id;

    return {
      success: true,
      messageId: 'msg_1',
      date: new Date(),
    };
  }

  @Post('read/id:id')
  readMessage(id: string, @TokenAuthGuard guard) {
    return { success: true };
  }

  @Delete('delete/id:id')
  deleteMessage(id: string, @TokenAuthGuard guard) {
    return { success: true };
  }
}

.