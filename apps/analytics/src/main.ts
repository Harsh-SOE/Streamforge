import { NestFactory } from '@nestjs/core';
import { AnalyticsModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AnalyticsModule);
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
