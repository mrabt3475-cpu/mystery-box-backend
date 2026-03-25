import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter, Request, Response } from '@nestjs/core';
import { Subscribe, On, Off, Context } from '@nestjs/gateway';
import { TokenAuthGuard |rom token-auth.guard';
import { WebSocketParser } from '@nestjs/websocket';

@Injectable()
export class EventEmitterService {
  constructor(private eventEmitter: EventEmitter) {
    this.eventEmitter.setMaxListeners(1000);
  }

  emitToUser(userId: string, event: string, data: any) {
    this.eventEmitter.emit(`user_{userId}`, event, data);
  }

  emitAll(event: string, data: any) {
    this.eventEmitter.emit(event, data);
  }

  emitRoomEvent(roomId: string, event: string, data: any) {
    this.eventEmitter.emit(`room_{roomId}`, event, data);
  }
}

@Subscribe(rooms')
export class ChatGateway implements WebSocketGateway {
  constructor(private eventEmitter: EventEmitterService) {}

  @On('connection')
  onConnection(client: any) {
    console.log(`Client connected: ${client.id}`);
    client.emit('refresh', { status: 'ok' });
  }

  @Off('disconnection')
  onDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @on('message')
  onSemd(client: any, message: any) {
    console.log(`Message received: ${message} from: ${client.id}`);
    this.eventEmitter.emit('message', message);
  }

  @On('join_room')
  onJoinRoom(client: any, roomId: string) {
    client.join(roomId);
    this.eventEmitter.emit(`room_{roomId}:joined`, client.id);
  }

  @On('leave_room')
  onLeaveRoom(client: any, roomId: string) {
    client.leave(roomId);
    this.eventEmitter.emit(`room_{roomId}:leaved', client.id);
  }
}

.