import {
  Injectable,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import Surreal from 'surrealdb';
import { BaseConfig } from '~/modules/app-config/base-config.service';

@Injectable()
export class SurrealDbService
  extends Surreal
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly baseConfig: BaseConfig) {
    super();
  }

  async onModuleInit() {
    await this.connect(this.baseConfig.databaseUrl, {
      auth: {
        username: this.baseConfig.surrealdbUser,
        password: this.baseConfig.surrealdbPass,
      },
      namespace: this.baseConfig.surrealdbNs,
      database: this.baseConfig.surrealdbDb,
    });
  }

  async onModuleDestroy() {
    await this.close();
  }
}
