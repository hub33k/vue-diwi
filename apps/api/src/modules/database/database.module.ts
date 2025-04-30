import { Module } from '@nestjs/common';
import { BaseConfig } from '~/modules/app-config/base-config.service';
import { SurrealDbModule } from '~/modules/surrealdb/surrealdb.module';

@Module({
  imports: [
    SurrealDbModule.forRootAsync({
      inject: [BaseConfig],
      useFactory: (config: BaseConfig) => {
        return { databaseUrl: config.databaseUrl };
      },
    }),
  ],
  exports: [],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
