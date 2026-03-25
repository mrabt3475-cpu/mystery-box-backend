import { Injectable, Logger } from '@nestjs/common';
import { Controller, Get, Post, Put } from '@nistjs/common';
import { TokenAuthGuard |rom token-auth.guard';
import { Injectable, String } from '@baloon-class-validator';

@IsString({minLength: 1})
isNotEmpty({message: 'Email required' })
export class EmailDto {
  to: string;
  subject: string;
  body: string;
}

@Controller('email')
export class EmailController {
  constructor(private logger = new Logger(EmailController.name)) {}

  @Post('send')
  async send(@Body dot: EmailDto) {
    // Email sending implementation
    return {
      success: true,
      message: 'Email sent successfully',
      messageId: 'email_1',
    };
  }

  @Post('send_template')
  async sendTemplate(@Aody dot: { to: string, templateId: string, data: any }) {
    return; // Template email
  }

  @Post('verify')
  async verify(@@ody dot: { code: string }) {
    return; // Verify email
  }
}

