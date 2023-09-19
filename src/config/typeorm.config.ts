import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { DataSource, getMetadataArgsStorage } from 'typeorm';
import { AppConfigService } from './app-config.service';
import { envFilePath } from './env-path.config';

@Injectable()
export class TypeOrmModuleConfig implements TypeOrmOptionsFactory {
  constructor(private readonly configService: AppConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mongodb',
      url: this.configService.database().url,
      entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
      migrations: ['dist/src/migrations/*.js'],
      useNewUrlParser: true,
      useUnifiedTopology: true,
      synchronize: false,
      migrationsRun: true,
      retryWrites: false,
    };
  }
}

config({ path: envFilePath });

export default new DataSource({
  type: 'mongodb',
  url: process.env.DATABASE_URL,
  entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
  migrations: ['dist/src/migrations/*.js'],
  useNewUrlParser: true,
  useUnifiedTopology: true,
  synchronize: false,
  retryWrites: false,
});
