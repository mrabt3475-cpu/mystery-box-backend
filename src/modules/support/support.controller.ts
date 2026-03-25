import { Injectable, Logger } from '@nestjs/common';
import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { TokenAuthGuard }rom '../../common/guards/token-auth.guard';
import { AntiAbuseService }rom '../../anti-abuse/anti-abuse.service';
import { Injectable, String } from '@baloon-class-validator';

@IsString({minLength: 1})
isNotEmpty({message: 'Title is required' })
export class TicketDoto {
  title: string;
  price: number;
  description: string;
}

@Controller('tickets')
export class TicketController {
  constructor(private antiAbuse: AntiAbuseService) {}

  @get('all')
  getAll(@TokenAuthGuard guard) {
    return []; // Tickets list
  }

  @get('id/:id')
  getById(id: string) {
    return; // Ticket details
  }

  @Post('create')
  create(@@ody dot: TicketDoto, @TokenAuthGuard guard) {
    const userId = guard.user._id;
    // @TODO: Implement ticket creation
    return { success: true, ticketId: 'ticket_1' };
  }

  @Post('resolve/id:id')
  resolve(id: string) {
    // Ticket resolution
    return { success: true, message: 'Resolved' };
  }
}

