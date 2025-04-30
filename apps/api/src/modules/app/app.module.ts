import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from '~/modules/app-config/app-config.module';
import { DatabaseModule } from '~/modules/database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Global Modules
    ConfigModule.forRoot({
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}.local`,
        '.env',
        `.env.${process.env.NODE_ENV || 'development'}`,
      ],
      cache: true,
      isGlobal: true,
    }),
    AppConfigModule,

    // Non-global Modules
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
