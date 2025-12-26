import { NestFactory } from '@nestjs/core';
import { RootModule } from './root.module';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  await app.listen(process.env.port ?? 3000);
}

bootstrap()
  .then(() => {
    console.log(`Analytics microservice started successfully`);
  })
  .catch((error) => {
    console.log(`An Error occured while starting the analytics service`);
    console.error(error);
    process.exit(1);
  });
