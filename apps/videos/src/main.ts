import { GrpcOptions } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';

import { RootModule } from './root.module';
import { VideosConfigService } from './infrastructure/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);

  const configService = app.get(VideosConfigService);

  await app.listen(configService.HTTP_PORT);

  app.connectMicroservice<GrpcOptions>(configService.GRPC_OPTIONS);

  await app.startAllMicroservices();
}
bootstrap()
  .then(() => console.log(`Videos microservice started successfully`))
  .catch((error) => {
    console.log(`An error occured while starting videos microservice`);
    console.error(error);
    process.exit(1);
  });
