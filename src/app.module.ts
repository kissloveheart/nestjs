import {
	ClassSerializerInterceptor,
	MiddlewareConsumer,
	Module,
	NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envFilePath } from '@/config/env-path.config';
import { WinstonModule } from 'nest-winston';
import { LoggerConfig } from '@/config/winston.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleConfig } from '@/config/typeorm.config';
import databaseConfig from '@/config/env/database.config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from '@/filter/http-exception.filter';
import { configValidationSchema } from '@/config/config.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseModuleConfig } from '@/config/mongoose.config';
import { UsersModule } from '@/modules/users/users.module';
import { UserRolesModule } from '@/modules/user-roles/user-roles.module';
import { TopicsModule } from '@/modules/topics/topics.module';
import { CollectionModule } from '@/modules/collection/collection.module';
import { FlashCardsModule } from '@/modules/flash-cards/flash-cards.module';
import { MongooseExceptionFilter } from '@/filter/mongoose-exception.filter';
import { LoggerMiddleware } from '@/logger/logger.middleware';
import { NODE_ENV } from '@/constant/env.constant';
import { PRODUCTION } from '@/constant/common.constant';
import { LoggerModule } from '@/logger/logger.module';

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
		MongooseModule.forRootAsync({
			imports: [ConfigModule.forFeature(databaseConfig)],
			useClass: MongooseModuleConfig,
		}),
		LoggerModule,
		UsersModule,
		UserRolesModule,
		TopicsModule,
		CollectionModule,
		FlashCardsModule,
	],
	providers: [
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
		{
			provide: APP_FILTER,
			useClass: MongooseExceptionFilter,
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
			consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
