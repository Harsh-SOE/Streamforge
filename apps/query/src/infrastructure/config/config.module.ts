import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';

import { QueryConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env',
      isGlobal: true,
      validationSchema: joi.object({
        HTTP_PORT: joi.string().required(),
        GRPC_PORT: joi.string().required(),
        DATABASE_URL: joi.string().required(),
      }),
    }),
  ],
  providers: [QueryConfigService],
  exports: [QueryConfigService],
})
export class QueryConfigModule {}
