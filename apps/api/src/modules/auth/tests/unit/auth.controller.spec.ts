import { beforeEach, describe, expect, it } from 'bun:test';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import { SurrealDbService } from '~/modules/surrealdb/surrealdb.service';
import { BaseConfig } from '../../../app-config/base-config.service';
import { UsersService } from '../../../users/users.service';
import { AuthController } from '../../auth.controller';
import { AuthService } from '../../auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        JwtService,
        AuthService,
        UsersService,
        SurrealDbService,
        BaseConfig,
        ConfigService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
