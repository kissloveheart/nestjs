import { configValidationSchema } from '@/config/config.schema';
import { envFilePath } from '@/config/env-path.config';
import databaseConfig from '@/config/env/database.config';
import { TypeOrmModuleConfig } from '@/config/typeorm.config';
import { LoggerConfig } from '@/config/winston.config';
import { PRODUCTION } from '@/constant/common.constant';
import { NODE_ENV } from '@/constant/env.constant';
import { HttpExceptionFilter } from '@/filter/http-exception.filter';
import {
	ClassSerializerInterceptor,
	MiddlewareConsumer,
	Module,
	NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { LogMiddleware } from './common/middleware/log.middleware';
import { RoleModule } from '@/modules/role/role.module';
import { UserModule } from '@/modules/user/user.module';
import { TypeormExceptionFilter } from '@/filter/typeorm-exception.filter';
import { LogErrorInterceptor } from './common/interceptors/log-error.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ClsModule } from 'nestjs-cls';

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
		WinstonModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => {
				return new LoggerConfig(configService).transports();
			},
			inject: [ConfigService],
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule.forFeature(databaseConfig)],
			useClass: TypeOrmModuleConfig,
		}),
		ClsModule.forRoot({
			global: true,
			middleware: { mount: true },
		}),
		UserModule,
		RoleModule,
	],
	providers: [
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
		{
			provide: APP_FILTER,
			useClass: TypeormExceptionFilter,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ResponseInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: LogErrorInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ClassSerializerInterceptor,
		},
	],
})
export class AppModule implements NestModule {
	constructor(private readonly configService: ConfigService) {}

	configure(consumer: MiddlewareConsumer): void {
		this.configService.get<string>(NODE_ENV) !== PRODUCTION &&
			consumer.apply(LogMiddleware).forRoutes('*');
	}
}
