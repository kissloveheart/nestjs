import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { swaggerConfig } from '@config';
import { COMMA } from '@constant';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.use(helmet());

  app.enableCors({
    origin: configService.get<string>('ALLOW_ORIGINS').split(COMMA),
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  swaggerConfig(app);
  const port = configService.get<number>('PORT');
  await app.listen(port, '0.0.0.0');
  Logger.log(`Server is listening on ${await app.getUrl()}`, 'Bootstrap');
}

bootstrap();
