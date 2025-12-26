import { NestFactory } from '@nestjs/core';
import { GrpcOptions } from '@nestjs/microservices';

import { ViewsConfigService } from './infrastructure/config';
import { RootModule } from './root.module';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);

  const configService = app.get(ViewsConfigService);
  app.connectMicroservice<GrpcOptions>(configService.GRPC_OPTIONS);
  await app.startAllMicroservices();
  await app.listen(configService.HTTP_PORT, '0.0.0.0');
}
bootstrap()
  .then(() => console.log(`Views service started successfully`))
  .catch((error) => {
    console.log(`An error occured while starting views service`);
    console.error(error);
  });
