import { NestFactory } from '@nestjs/core';
import { GrpcOptions } from '@nestjs/microservices';

import { RootModule } from './root.module';
import { QueryConfigService } from './infrastructure/config';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);

  const configService = app.get(QueryConfigService);
  app.connectMicroservice<GrpcOptions>(configService.GRPC_OPTIONS);

  await app.listen(configService.HTTP_PORT, '0.0.0.0');
  await app.startAllMicroservices();
}
bootstrap()
  .then(() => {
    console.log(`Query microservice started successfully`);
  })
  .catch((error) => {
    console.log(`An Error occured while starting the query service`);
    console.error(error);
    process.exit(1);
  });
