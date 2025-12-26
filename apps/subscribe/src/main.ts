import { NestFactory } from '@nestjs/core';
import { GrpcOptions } from '@nestjs/microservices';

import { RootModule } from './root.module';
import { SubscribeConfigService } from './infrastructure/config';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  const configService = app.get(SubscribeConfigService);
  await app.listen(configService.HTTP_PORT, '0.0.0.0');
  app.connectMicroservice<GrpcOptions>(configService.GRPC_OPTIONS);
  await app.startAllMicroservices();
}

bootstrap()
  .then(() => {
    console.log(`Subscribe service started successfully`);
  })
  .catch((error) => {
    console.error(`An Error occured while starting Subscribe service`, error);
    process.exit(1);
  });
