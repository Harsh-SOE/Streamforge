import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';
import { execSync } from 'child_process';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';

import { LOGGER_PORT } from '@app/ports/logger';
import { PrismaDatabaseHandler } from '@app/handlers/database-handler';
import { UserRepositoryAdapter } from '@users/infrastructure/repository/adapters';

import { UserAggregate } from '@users/domain/aggregates';
import { PRISMA_CLIENT, PRISMA_CLIENT_NAME, PrismaDBClient } from '@app/clients/prisma';
import { UserAggregatePersistanceACL } from '@users/infrastructure/anti-corruption/aggregate-persistance-acl';

import { PrismaClient as UserPrismaClient } from '@persistance/users';

describe('UserRepositoryAdapter (Integration)', () => {
  let container: StartedPostgreSqlContainer;
  let adapter: UserRepositoryAdapter;

  jest.setTimeout(60000);

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:latest').start();
    const databaseUrl = container.getConnectionUri();
    process.env.DATABASE_URL = databaseUrl;
    console.log(`Connecting to ${databaseUrl}...`);

    execSync(`npx prisma migrate deploy --schema apps/users/prisma/schema.prisma`, {
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
      },
    });

    console.log(`Migrations applied successfully`);

    console.log(`Test database started successfully`);
  });

  afterAll(async () => {
    await container.stop();
    console.log(`Test database shutdown successfully`);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepositoryAdapter,
        UserAggregatePersistanceACL,
        PrismaDatabaseHandler,
        PrismaDBClient,
        {
          provide: PRISMA_CLIENT,
          useValue: UserPrismaClient,
        },
        {
          provide: PRISMA_CLIENT_NAME,
          useValue: 'users',
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

    await module.init();

    const userPrismaClient = module.get(PrismaDBClient<UserPrismaClient>);
    await userPrismaClient.client.$executeRawUnsafe(`TRUNCATE TABLE "User" CASCADE;`);

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
