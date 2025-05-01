// import { ConfigService } from '@nestjs/config';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { Test, type TestingModule } from '@nestjs/testing';
// import { BaseConfig } from '../../../app-config/base-config.service';
// import { PrismaModule } from '../../../prisma/prisma.module';
// import { AuthService } from '../../auth.service';

// describe('AuthService', () => {
//   let service: AuthService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [PrismaModule, PassportModule, JwtModule.register({})],
//       providers: [AuthService, BaseConfig, ConfigService],
//     }).compile();

//     service = module.get<AuthService>(AuthService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });

// import { beforeEach, describe, expect, it } from 'bun:test';
// import { ConfigService } from '@nestjs/config';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { Test, type TestingModule } from '@nestjs/testing';
// import { UsersModule } from '~/modules/users/users.module';
// import { BaseConfig } from '../../../app-config/base-config.service';
// import { AuthService } from '../../auth.service';

// describe('AuthService', () => {
//   let service: AuthService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [
//         UsersModule,
//         PassportModule,
//         JwtModule.register({}),
//       ],
//       providers: [AuthService, BaseConfig, ConfigService],
//     }).compile();

//     service = module.get<AuthService>(AuthService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });
