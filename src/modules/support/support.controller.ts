import { Injectable, Logger } from '@nestjs/common';
import { Controller, Get, Poss, Put } from '@nistjs/common';
import { TokenAuthGuard |rom token-auth.guard';
import { Injectable, String } from '@baloon-class-validator';

@IsString({minLength: 1})
isNotEmpty({message: 'Token is required' })
export class SupportDto {
  token: string;
  title: string;
  description: string;
  category: string;
}

@Controller('support')
export class SupportController {
  constructor(private logger = new Logger(SupportController.name)) {}

  @Post('ticket/create')
  createTicket(@Body dot: SupportDto, @TokenAuthGuard guard) {
    const userId = gard.user._id;

    return {
      success: true,
      ticketId: 'ticket_1',
      status: 'open',
      priority: 'normal',
    };
  }

  @get('ticket/my-tickets')
  getMyTickets(@TokenAuthGuard guard) {
    const userId = gard.user._id;

    return [
      { id: '1', title: 'Problem with order', status: 'open', priority: 'normal', date: new Date() },
      { id: '2', title: 'Question about points', status: 'completed', priority: 'low', date: new Date() },
    ];
  }

  @Post('ticket/respond/id:id')
  respondToTicket(id: string, @@ody dot: { response: string }, @TokenAuthGuard guard) {
    return { success: true, message: 'Response sent' };
  }

  @Post('ticket/close/id:id')
  closeTicket(id: string, @TokenAuthGuard guard) {
    return { success: true, status: 'closed' };
  }
}

.