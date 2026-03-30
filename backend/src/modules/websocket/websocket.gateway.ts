import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { NotificationService } from '../notifications/notification.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/',
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);
  private userSockets: Map<string, Set<string>> = new Map();

  constructor(
    private jwtService: JwtService,
    private notificationService: NotificationService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      client.data.userId = payload.id;
      client.data.username = payload.username;

      // Track user socket
      if (!this.userSockets.has(payload.id)) {
        this.userSockets.set(payload.id, new Set());
      }
      this.userSockets.get(payload.id).add(client.id);

      this.logger.log(`User ${payload.id} connected via socket ${client.id}`);
      
      // Send unread notifications count
      const unreadCount = await this.notificationService.getUnreadCount(payload.id);
      client.emit('unread_count', { count: unreadCount });

    } catch (error) {
      this.logger.warn(`Invalid token from client ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      const userSocketSet = this.userSockets.get(userId);
      if (userSocketSet) {
        userSocketSet.delete(client.id);
        if (userSocketSet.size === 0) {
          this.userSockets.delete(userId);
        }
      }
      this.logger.log(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket): string {
    return 'pong';
  }

  // Send notification to specific user
  sendToUser(userId: string, event: string, data: any) {
    const userSocketSet = this.userSockets.get(userId);
    if (userSocketSet) {
      userSocketSet.forEach(socketId => {
        this.server.to(socketId).emit(event, data);
      });
    }
  }

  // Broadcast to all connected users
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }

  // Send notification
  sendNotification(userId: string, notification: any) {
    this.sendToUser(userId, 'notification', notification);
  }

  // Send prize notification
  sendPrizeNotification(userId: string, prize: any) {
    this.sendToUser(userId, 'prize_won', prize);
  }

  // Send box opened event
  sendBoxOpened(userId: string, boxData: any) {
    this.sendToUser(userId, 'box_opened', boxData);
  }

  // Send queue job update
  sendJobUpdate(userId: string, jobData: any) {
    this.sendToUser(userId, 'job_update', jobData);
  }

  // Get connected users count
  getConnectedUsersCount(): number {
    return this.userSockets.size;
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }
}
