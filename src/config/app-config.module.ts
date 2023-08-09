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
import databaseConfig from './env/database.config';
import authConfig from './env/auth.config';

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: envFilePath,
			cache: true,
			expandVariables: true,
			validationSchema: configValidationSchema,
			validationOptions: {
				abortEarly: false,
			},
		}),
		ConfigModule.forFeature(databaseConfig),
		ConfigModule.forFeature(authConfig),
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
	],
	providers: [AppConfigService],
	exports: [AppConfigService],
})
export class AppConfigModule {}
