import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
export class AppGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(AppGateway.name);

  handleConnection(client: Socket) {
    this.logger.log('Client connected: ' + client.id);
  }

  @SubscribeMessage('auth')
  handleAuth(client: Socket, data: { token: string }) {
    client.join('user:' + data.token);
    return { success: true };
  }

  emitToUser(userId: string, event: string, data: any) {
    this.server.to('user:' + userId).emit(event, data);
  }

  emitBoxOpened(userId: string, result: any) {
    this.emitToUser(userId, 'box.opened', result);
  }
}