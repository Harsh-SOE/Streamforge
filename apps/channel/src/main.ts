import { NestFactory } from '@nestjs/core';
import { GrpcOptions } from '@nestjs/microservices';

import { RootModule } from './root.module';
import { ChannelConfigService } from './infrastructure/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  const configService = app.get(ChannelConfigService);
  app.connectMicroservice<GrpcOptions>(configService.SERVICE_OPTIONS);
  await app.startAllMicroservices();
  await app.listen(configService.HTTP_PORT, '0.0.0.0');
}

bootstrap()
  .then(() => {
    console.log(`ENV: ${process.env.NODE_ENV ? `DEVELOPMENT` : `PRODUCTION`}`);
    console.log(`Channel service started successfully`);
  })
  .catch((err) => {
    console.log(`An error occured while starting the channel service`);
    console.error(err);
  });
