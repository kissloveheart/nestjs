import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { DatabaseConfig } from '@/config/env/database.config';
import { getMetadataArgsStorage } from 'typeorm';

@Injectable()
export class TypeOrmModuleConfig implements TypeOrmOptionsFactory {
	constructor(private readonly configService: ConfigService) {}

	createTypeOrmOptions(): TypeOrmModuleOptions {
		const databaseConfig = this.configService.get<DatabaseConfig>('database');
		return {
			type: 'mongodb',
			url: databaseConfig.url,
			logging: databaseConfig.isLogging,
			entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
			useNewUrlParser: true,
			useUnifiedTopology: true,
			synchronize: false,
		};
	}
}
