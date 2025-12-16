import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { LOGGER_PORT, LoggerPort } from '@app/ports/logger';
import { PrismaDatabaseHandler } from '@app/handlers/database-handler';

import { PrismaClient } from '@persistance/users';

@Injectable()
export class UserPrismaClient implements OnModuleInit, OnModuleDestroy {
  public prismaClient = new PrismaClient();
  public user = this.prismaClient.user;

  public constructor(
    private readonly prismaHandler: PrismaDatabaseHandler,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
  ) {}

  public async onModuleInit() {
    const connectToDatabaseOperation = async () => await this.prismaClient.$connect();

    await this.prismaHandler.execute(connectToDatabaseOperation, {
      operationType: 'CONNECT_OR_DISCONNECT',
    });

    this.logger.info(`Database connected successfully`);
  }

  public async onModuleDestroy() {
    const disconnectFromDatabaseOperation = async () => await this.prismaClient.$disconnect();

    await this.prismaHandler.execute(disconnectFromDatabaseOperation, {
      operationType: 'CONNECT_OR_DISCONNECT',
    });

    this.logger.info(`Database disconnected successfully`);
  }
}
