import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';
import { execSync } from 'child_process';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';

import { UserRepositoryAdapter } from '@users/infrastructure/repository/adapters';
import { PrismaDatabaseHandler } from '@app/handlers/database-handler';
import { LOGGER_PORT } from '@app/ports/logger';

import { UserAggregatePersistanceACL } from '@users/infrastructure/anti-corruption/aggregate-persistance-acl';
import { UserAggregate } from '@users/domain/aggregates';
import { UserPrismaClient } from '@users/infrastructure/repository/client';

import { PrismaClient } from '@persistance/users';

describe('UserRepositoryAdapter (Integration)', () => {
  let container: StartedPostgreSqlContainer;
  let adapter: UserRepositoryAdapter;
  let prismaClient: PrismaClient;

  jest.setTimeout(60000);

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:latest').start();
    const databaseUrl = container.getConnectionUri();

    console.log(`Connecting to ${databaseUrl}...`);

    execSync(`npx prisma migrate deploy --schema apps/users/prisma/schema.prisma`, {
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
      },
    });

    console.log(`Migrations applied successfully`);

    prismaClient = new PrismaClient({
      datasources: {
        db: { url: databaseUrl },
      },
    });
    await prismaClient.$connect();

    console.log(`Test database started successfully`);
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
    await container.stop();
    console.log(`Test database shutdown successfully`);
  });

  beforeEach(async () => {
    await prismaClient.$executeRawUnsafe(`TRUNCATE TABLE "User" CASCADE;`);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepositoryAdapter,
        UserAggregatePersistanceACL,
        PrismaDatabaseHandler,
        {
          provide: UserPrismaClient,
          useValue: prismaClient,
        },
        {
          provide: LOGGER_PORT,
          useValue: {
            info: console.log,
            error: console.error,
            alert: console.warn,
            fatal: console.error,
          },
        },
      ],
    }).compile();

    adapter = module.get<UserRepositoryAdapter>(UserRepositoryAdapter);
  });

  describe('saveOneUser & findOneUserById', () => {
    it('should save a user to the DB and be able to retrieve it', async () => {
      const id = uuidv4();
      const userAggregate = UserAggregate.create({
        id,
        userAuthId: 'authId',
        handle: 'coolUser',
        email: 'test@test.com',
        avatarUrl: 'http://avatar.com',
      });

      const savedUser = await adapter.saveOneUser(userAggregate);
      expect(savedUser.getUserSnapshot().id).toBe(id);
      console.log(`Saved User is: `, savedUser.getUserSnapshot());

      const foundUser = await adapter.findOneUserById(id);
      expect(foundUser).toBeDefined();
      expect(foundUser!.getUserSnapshot().email).toBe('test@test.com');
      expect(foundUser!.getUserSnapshot().handle).toBe('coolUser');
      console.log(`found User is: `, foundUser?.getUserSnapshot());
    });
  });
});
