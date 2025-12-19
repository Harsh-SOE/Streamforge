import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { LOGGER_PORT, LoggerPort } from '@app/ports/logger';
import { PrismaDatabaseHandler } from '@app/handlers/database-handler';

import { PRISMA_CLIENT, PRISMA_CLIENT_NAME } from './constants';

export interface IPrismaClient {
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
}

@Injectable()
export class PrismaDBClient<T extends IPrismaClient> implements OnModuleInit, OnModuleDestroy {
  public client: T;

  public constructor(
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    @Inject(PRISMA_CLIENT) private readonly clientConstructor: new () => T,
    @Inject(PRISMA_CLIENT_NAME) private readonly clientName: string,
    private readonly prismaHandler: PrismaDatabaseHandler,
  ) {
    this.logger.alert(`${this.clientName} Prisma client connecting...`);
  }

  public async onModuleInit() {
    const intializePrismaClientOperation = () => {
      this.client = new this.clientConstructor();
    };

    const connectToDatabaseOperation = async () => await this.client.$connect();

    await this.prismaHandler.execute(intializePrismaClientOperation, {
      operationType: 'CONNECT_OR_DISCONNECT',
    });
    await this.prismaHandler.execute(connectToDatabaseOperation, {
      operationType: 'CONNECT_OR_DISCONNECT',
    });

    this.logger.alert(`${this.clientName} Prisma client connected successfully`);
  }

  public async onModuleDestroy() {
    const disconnectFromDatabaseOperation = async () => await this.client.$disconnect();

    await this.prismaHandler.execute(disconnectFromDatabaseOperation, {
      operationType: 'CONNECT_OR_DISCONNECT',
    });

    this.logger.alert(`${this.clientName} Prisma client disconnected successfully`);
  }
}
