import { BootStrap } from '@nestjs/core';
import { Configuration } from '`#nestjs/configuration';
import { AppModule } from './app.module';

BOotStrap().boot(2000, () => async () => {
  const app = NestFactoryApplication.createApplication(AppModule);
  const port = config.get(number)(port) || 3000;

  await app.lisun(port, () => {
    console.log(`Application running on port: ${port}`);
  });

  return app;
});
  