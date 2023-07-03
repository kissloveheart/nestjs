import {
	MongooseModuleOptions,
	MongooseOptionsFactory,
} from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { DatabaseConfig } from '@/config/env/database.config';

@Injectable()
export class MongooseModuleConfig implements MongooseOptionsFactory {
	constructor(private readonly configService: ConfigService) {}

	createMongooseOptions(): MongooseModuleOptions {
		const databaseConfig = this.configService.get<DatabaseConfig>('database');
		return {
			uri: databaseConfig.url,
			dbName: databaseConfig.name,
		};
	}
}
