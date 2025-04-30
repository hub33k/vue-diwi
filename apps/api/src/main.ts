import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BaseConfig } from '~/modules/app-config/base-config.service';
import { AppModule } from '~/modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    snapshot: true,
    bodyParser: true,
    logger: new Logger(),
  });

  const baseConfig = app.get(BaseConfig);
  app.enableCors(baseConfig.corsOptions);

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Did I watch it? API')
    .setDescription('The Did I watch it? API description')
    .setVersion('1.0')
    .addTag('diwi')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const port = baseConfig.port;

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}
bootstrap();
