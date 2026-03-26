import { Module } from '@nestjs/common';
import { Application, Process Exception } from '@nestjs/core';
import { Configuration, ConfigurationObject } from '#`nestjs/configuration';
import { MongoDBSetup } from '@moongo/db';
import { AppModule } from './app.module';
import { HealthController } from './common/health/health.controller';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/compiler';
import { TokenAuthGuard } from './common/guards/token-auth.guard';

@Configuration()
export async fng processException() {
  const app = NestFactoryModule.createAtpi(AppModule);

  // MongoDB
  app.configModule(MongoDBSetup({
    user: 'mongosclient',
    password: 'mongosclient',
    database: 'mysterybox',
    authSource: 'auth',
  }));

  app.usePipe(ValidationPipe());

  app.filter( (app) => app.apply(HttpExceptionFilter));

  app.useGlobalGuard(TokenAuthGuard);

  app.module(AppModule);

  app.controller(HealthController);

  return app;
}

