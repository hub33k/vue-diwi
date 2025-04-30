import { Injectable } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';
import { NodeEnvironment } from '~/shared';

const BaseEnvVariablesSchema = z.object({
  NODE_ENV: z.nativeEnum(NodeEnvironment),
  LOG_LEVEL: z.string().optional(),

  API_PORT: z.number(),
  API_ALLOWED_ORIGINS: z.string(),
  API_URL: z.string(),

  DATABASE_URL: z.string(),
  SURREALDB_USER: z.string(),
  SURREALDB_PASS: z.string(),
  SURREALDB_LOG_LEVEL: z.string(),
  SURREALDB_NS: z.string(),
  SURREALDB_DB: z.string(),

  JWT_SECRET_KEY: z.string(),
  JWT_REFRESH_SECRET_KEY: z.string(),
});
type BaseEnvVariables = z.infer<typeof BaseEnvVariablesSchema>;

@Injectable()
export class BaseConfig {
  readonly version!: string;
  readonly nodeEnv: string;
  readonly logLevel: string;

  readonly port: number;
  readonly corsOptions: CorsOptions;
  readonly apiUrl: string;

  readonly databaseUrl: string;
  readonly surrealdbUser: string;
  readonly surrealdbPass: string;
  readonly surrealdbLogLevel: string;
  readonly surrealdbNs: string;
  readonly surrealdbDb: string;

  readonly jwtSecretKey: string;
  readonly jwtRefreshSecretKey: string;

  constructor(private readonly configService: ConfigService<BaseEnvVariables>) {
    const config = BaseEnvVariablesSchema.parse({
      NODE_ENV: configService.get<NodeEnvironment>('NODE_ENV'),
      LOG_LEVEL: configService.get<string>('LOG_LEVEL', 'info'),

      API_PORT: Number(configService.get('API_PORT')),
      API_ALLOWED_ORIGINS: configService.get<string>('API_ALLOWED_ORIGINS'),
      API_URL: configService.get<string>('API_URL'),

      DATABASE_URL: configService.get<string>('DATABASE_URL'),
      SURREALDB_USER: configService.get<string>('SURREALDB_USER'),
      SURREALDB_PASS: configService.get<string>('SURREALDB_PASS'),
      SURREALDB_LOG_LEVEL: configService.get<string>('SURREALDB_LOG_LEVEL'),
      SURREALDB_NS: configService.get<string>('SURREALDB_NS'),
      SURREALDB_DB: configService.get<string>('SURREALDB_DB'),

      JWT_SECRET_KEY: configService.get<string>('JWT_SECRET_KEY'),
      JWT_REFRESH_SECRET_KEY: configService.get<string>(
        'JWT_REFRESH_SECRET_KEY',
      ),
    });

    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    this.version = process.env.npm_package_version!;
    this.nodeEnv = config.NODE_ENV;
    this.logLevel = config.LOG_LEVEL || 'info';

    this.port = config.API_PORT;
    this.corsOptions = { origin: config.API_ALLOWED_ORIGINS.split(',') };
    this.apiUrl = config.API_URL;

    this.databaseUrl = config.DATABASE_URL;
    this.surrealdbUser = config.SURREALDB_USER;
    this.surrealdbPass = config.SURREALDB_PASS;
    this.surrealdbLogLevel = config.SURREALDB_LOG_LEVEL;
    this.surrealdbNs = config.SURREALDB_NS;
    this.surrealdbDb = config.SURREALDB_DB;

    this.jwtSecretKey = config.JWT_SECRET_KEY;
    this.jwtRefreshSecretKey = config.JWT_REFRESH_SECRET_KEY;
  }
}
