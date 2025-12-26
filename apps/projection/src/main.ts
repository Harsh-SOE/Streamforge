import { NestFactory } from '@nestjs/core';
import { KafkaOptions } from '@nestjs/microservices';

import { RootModule } from './root.module';
import { ProjectionConfigService } from './infrastructure/config';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  const configService = app.get(ProjectionConfigService);
  app.connectMicroservice<KafkaOptions>(configService.KAFKA_OPTIONS);
  await app.startAllMicroservices();
  await app.listen(configService.HTTP_PORT, '0.0.0.0');
}
bootstrap()
  .then(() => console.log(`Projection service started successfully`))
  .catch((error) => {
    console.log(`An error occured while starting projection service`);
    console.error(error);
    process.exit(1);
  });
