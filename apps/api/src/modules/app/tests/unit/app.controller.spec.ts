import { Test, type TestingModule } from '@nestjs/testing';
import { SurrealDbService } from '~/modules/surrealdb/surrealdb.service';
import { AppController } from '../../app.controller';
import { AppService } from '../../app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const mockSurrealDbService = {
      query: () => [
        {
          created_at: '2025-04-30T10:46:56.926Z',
          email: 'test0@test.com',
          id: 'user:8kgb32150x567qgvy6qs',
          password_hash:
            '$argon2id$v=19$m=65536,t=2,p=1$r1+ey8gD/X5DqvoFnd5MGnAjNH9tBHT6fifNlzX8SNg$OgbTTMLmuEGO4+3oIoIaLTufmw/3agHKzv1AHm5Ajdo',
          updated_at: '2025-04-30T10:46:56.926Z',
          username: 'Bob 0',
        },
      ],
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: SurrealDbService,
          useValue: mockSurrealDbService,
        },
      ],
    })
      // .useMocker((token) => {
      //   const results = [
      //     {
      //       created_at: '2025-04-30T10:46:56.926Z',
      //       email: 'test0@test.com',
      //       id: 'user:8kgb32150x567qgvy6qs',
      //       password_hash:
      //         '$argon2id$v=19$m=65536,t=2,p=1$r1+ey8gD/X5DqvoFnd5MGnAjNH9tBHT6fifNlzX8SNg$OgbTTMLmuEGO4+3oIoIaLTufmw/3agHKzv1AHm5Ajdo',
      //       updated_at: '2025-04-30T10:46:56.926Z',
      //       username: 'Bob 0',
      //     },
      //   ];
      //   if (token === SurrealDbService) {
      //     return {
      //       query: jest.fn().mockResolvedValue(results),
      //     };
      //   }
      // })
      .compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });

    it('should return users', async () => {
      const res = await appController.getAllUsers();
      expect(res).toStrictEqual({
        created_at: '2025-04-30T10:46:56.926Z',
        email: 'test0@test.com',
        id: 'user:8kgb32150x567qgvy6qs',
        password_hash:
          '$argon2id$v=19$m=65536,t=2,p=1$r1+ey8gD/X5DqvoFnd5MGnAjNH9tBHT6fifNlzX8SNg$OgbTTMLmuEGO4+3oIoIaLTufmw/3agHKzv1AHm5Ajdo',
        updated_at: '2025-04-30T10:46:56.926Z',
        username: 'Bob 0',
      });
    });
  });
});
