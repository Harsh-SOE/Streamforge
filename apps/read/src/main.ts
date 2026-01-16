import { NestFactory } from '@nestjs/core';
import { GrpcOptions, KafkaOptions } from '@nestjs/microservices';

import { RootModule } from './root.module';
import { ReadConfigService } from './infrastructure/config';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  const configService = app.get(ReadConfigService);
  app.connectMicroservice<KafkaOptions>(configService.KAFKA_OPTIONS);
  app.connectMicroservice<GrpcOptions>(configService.GRPC_OPTIONS);

  await app.listen(configService.HTTP_PORT, '0.0.0.0');
  await app.startAllMicroservices();
}
bootstrap()
  .then(() => console.log(`Read service started successfully`))
  .catch((error) => {
    console.log(`An error occured while starting read service`);
    console.error(error);
    process.exit(1);
  });
