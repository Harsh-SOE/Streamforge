import { NestFactory } from '@nestjs/core';
// import { GrpcOptions } from '@nestjs/microservices';

import { RootModule } from './root.module';
import { PlaylistConfigService } from './infrastructure/config';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  const configService = app.get(PlaylistConfigService);
  await app.listen(configService.HTTP_PORT, '0.0.0.0');
  // app.connectMicroservice<GrpcOptions>(configService.GRPC_OPTIONS);
  // await app.startAllMicroservices();
}
bootstrap()
  .then(() => {
    console.log(`Playlist service started successfully`);
  })
  .catch((error) => {
    console.log(`An error occured while starting the playlist service`);
    console.error(error);
    process.exit(1);
  });
