import { ConfigurableModuleBuilder } from '@nestjs/common';

interface IExtraOptions {
  isGlobal?: boolean;
}

export interface ISurrealDbModuleOptions {
  databaseUrl: string;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ISurrealDbModuleOptions>()
    .setExtras<IExtraOptions>({ isGlobal: true }, (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }))
    .setClassMethodName('forRoot')
    .build();
