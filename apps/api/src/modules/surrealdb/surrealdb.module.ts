import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from '~/modules/surrealdb/surrealdb.module-definition';
import { SurrealDbService } from './surrealdb.service';

@Module({
  imports: [],
  exports: [SurrealDbService],
  controllers: [],
  providers: [SurrealDbService],
})
export class SurrealDbModule extends ConfigurableModuleClass {}
