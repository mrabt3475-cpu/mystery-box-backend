import { Module } from '@nestjs/common';
import { GatewayModule } from '@nestjs/gateway';
import { EventEmitterService } from './gateway.service';
import { ChatGateway } from './gateway.gateway';

@Module({
  modules: [GatewayModule],
  providers: [EventEmitterService],
  controllers: [ChatGateway],
  exports: [EventEmitterService],
})
export class GatewayModule {}

