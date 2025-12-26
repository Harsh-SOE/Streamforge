import { NestFactory } from '@nestjs/core';
import { GrpcOptions } from '@nestjs/microservices';

import { RootModule } from './root.module';
import { HistoryConfigService } from './infrastructure/config';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);

  const configService = app.get(HistoryConfigService);
  app.connectMicroservice<GrpcOptions>(configService.GRPC_OPTIONS);
  await app.startAllMicroservices();
  await app.listen(configService.HTTP_PORT, '0.0.0.0');
}
bootstrap()
  .then(() => console.log(`History service started successfully`))
  .catch((err) => {
    console.log(`An error occured while starting the history service`);
    console.error(err);
  });
