import { NestFactory } from '@nestjs/core';
import { GrpcOptions } from '@nestjs/microservices';

import { RootModule } from './root.module';
import { CommentsConfigService } from './infrastructure/config';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);

  const configService = app.get(CommentsConfigService);
  app.connectMicroservice<GrpcOptions>(configService.SERVICE_OPTION);

  await app.listen(configService.HTTP_PORT, '0.0.0.0');
  await app.startAllMicroservices();
}
bootstrap()
  .then(() => console.log(`Comments service started successfully`))
  .catch((err) => {
    console.log(`An error occured while starting the 'Comments' service`);
    console.error(err);
  });
