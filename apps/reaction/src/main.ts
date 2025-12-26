import { NestFactory } from '@nestjs/core';
import { GrpcOptions } from '@nestjs/microservices';

import { RootModule } from './root.module';
import { ReactionConfigService } from './infrastructure/config';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  const configService = app.get(ReactionConfigService);
  await app.listen(configService.HTTP_PORT, '0.0.0.0');
  app.connectMicroservice<GrpcOptions>(configService.GRPC_OPTIONS);
  await app.startAllMicroservices();
}
bootstrap()
  .then(() => {
    console.log(`Reaction service started successfully`);
  })
  .catch((error) => {
    console.log(`An error occured while starting the reaction service`);
    console.error(error);
    process.exit(1);
  });
