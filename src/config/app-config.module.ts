import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { ClsModule } from 'nestjs-cls';
import { AppConfigService } from './app-config.service';
import { configValidationSchema } from './config.schema';
import { envFilePath } from './env-path.config';
import { TypeOrmModuleConfig } from './typeorm.config';
import { LoggerConfig } from './winston.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', envFilePath],
      cache: true,
      expandVariables: true,
      validationSchema: configValidationSchema,
      validationOptions: {
        abortEarly: false,
      },
    }),
    WinstonModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (configService: AppConfigService) => {
        return new LoggerConfig(configService).transports();
      },
      inject: [AppConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useClass: TypeOrmModuleConfig,
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    ThrottlerModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        ttl: config.throttler().ttl,
        limit: config.throttler().limit,
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'public'),
      renderPath: '.well-known/(.*)',
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
