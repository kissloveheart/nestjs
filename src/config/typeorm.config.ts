import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { DatabaseConfig } from '@/config/env/database.config';
import { DataSource, getMetadataArgsStorage } from 'typeorm';
import { config } from 'dotenv';
import { envFilePath } from './env-path.config';

@Injectable()
export class TypeOrmModuleConfig implements TypeOrmOptionsFactory {
	constructor(private readonly configService: ConfigService) {}

	createTypeOrmOptions(): TypeOrmModuleOptions {
		const databaseConfig = this.configService.get<DatabaseConfig>('database');
		return {
			type: 'mongodb',
			url: databaseConfig.url,
			logging: databaseConfig.isLogging,
			entities: ['dist/entities/*.entity.js'],
			migrations: ['dist/migrations/*.js'],
			useNewUrlParser: true,
			useUnifiedTopology: true,
			synchronize: false,
			migrationsRun: true,
		};
	}
}

config({ path: envFilePath });

export default new DataSource({
	type: 'mongodb',
	url: process.env.DATABASE_URL,
	logging: process.env.DATABASE_LOGGING?.toLocaleLowerCase() === 'true',
	entities: ['dist/entities/*.entity.js'],
	migrations: ['dist/migrations/*.js'],
	useNewUrlParser: true,
	useUnifiedTopology: true,
	synchronize: false,
});
