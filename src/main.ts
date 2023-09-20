import { AppConfigModule, AppConfigService, swaggerConfig } from '@config';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.select(AppConfigModule).get(AppConfigService);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  });

  // app.use(helmet());

  app.enableCors({
    origin: configService.cors().origin,
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  if (!configService.isProduction()) {
    swaggerConfig(app);
  }
  const port = configService.port();
  await app.listen(port, '0.0.0.0');
  Logger.log(`Server is listening on ${await app.getUrl()}`, 'Bootstrap');
}

bootstrap();
