import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { AppConfigService } from './app-config.service';
import { envFilePath } from './env-path.config';

@Injectable()
export class TypeOrmModuleConfig implements TypeOrmOptionsFactory {
	constructor(private readonly configService: AppConfigService) {}

	createTypeOrmOptions(): TypeOrmModuleOptions {
		const databaseConfig = this.configService.getDatabase();
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
