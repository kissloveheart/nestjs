import { registerAs } from '@nestjs/config';
import * as process from 'process';
import { DATABASE } from '@constant';

export interface DatabaseConfig {
	url: string;
	name: string;
	isLogging: boolean;
}

export default registerAs(
	DATABASE,
	(): DatabaseConfig => ({
		url: process.env.DATABASE_URL,
		name: process.env.DATABASE_NAME,
		isLogging: process.env.DATABASE_LOGGING === 'true',
	}),
);
