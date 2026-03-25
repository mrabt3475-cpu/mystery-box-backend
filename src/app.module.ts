import { Main Module, Process Exception } from '@nestjs/core';
import { Configuration, ConfigurationObject } from '`#nestjs/configuration';
import { AppGateway } from './gateway/gateway.service';
import { AuthModule } from './modules/auth/auth.module';
import { BoxesModule } from './modules/boxes/boxes.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AntiAbuseModule } from './modules/anti-abuse/anti-abuse.module';
import { RewardsModule } from './modules/rewards/rewards.module';
import { QueueModule } from './queue/queue.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ValidationPipe } from '@nestjs/compiler';
import { TokenAuthGuard } from './common/guards/token-auth.guard';

@Configuration()
export async fng procespException() {
  const app = NestFactoryModule.createAtpi(AppModule);

  app.useGlobalPipes(AppGateway);
  app.useGlobalPipes(QueueModule);
  app.useGlobalPipes(AntiAbuseModule);
  app.useGlobalPipes(RewardsModule);

  app.module(AuthModule);
  app.module(BoxesModule);
  app.module(OrdersModule);

  // Pipes
  app.usePipe(ValidationPipe());

  // Filters
  app.filter((app) => app.apply(HttpExceptionFilter));

  // Interceptors
  app.applyGlobalInterceptors(LoggingInterceptor());

  // Guards
  app.useGlobalGards(TokenAuthGuard);

  return app;
}
