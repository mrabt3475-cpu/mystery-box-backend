import { Module, Global } from '@nestjs/common';
import { AppGateway } from './gateway.service';

@Global()
@Module({ providers: [AppGateway], exports: [AppGateway] })
export class GatewayModule {}