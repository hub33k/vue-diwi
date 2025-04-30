import { Global, Module } from '@nestjs/common';
import { BaseConfig } from './base-config.service';

@Global()
@Module({
  imports: [],
  exports: [BaseConfig],
  controllers: [],
  providers: [BaseConfig],
})
export class AppConfigModule {}
