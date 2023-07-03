import winston, { format, transports } from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { utilities } from 'nest-winston';
import { NODE_ENV } from '@/constant/env.constant';
import { PRODUCTION } from '@/constant/common.constant';

const formatLogger = format.printf((msg) => {
	const message = msg.message + msg.metadata?.error?.stack;
	return `${msg.metadata.timestamp} - ${msg.metadata.context}[${msg.level}]: ${message}`;
});

export class LoggerConfig {
	private readonly options: winston.LoggerOptions;

	constructor(configService: ConfigService) {
		this.options = {
			exitOnError: false,
		};

		if (configService.get<string>(NODE_ENV) === PRODUCTION) {
			this.options = {
				...this.options,
				transports: this.transportRotateFile(configService),
			};
		} else {
			this.options = {
				...this.options,
				transports: [
					this.transportConsole(configService),
					this.transportRotateFile(configService),
				],
			};
		}
	}

	public transports(): object {
		return this.options;
	}

	private transportConsole(configService: ConfigService) {
		return new transports.Console({
			level: configService.get<string>('LOG_CONSOLE_LEVEL'),
			format: format.combine(
				format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
				utilities.format.nestLike(),
			),
		});
	}

	private transportRotateFile(configService: ConfigService) {
		return new transports.DailyRotateFile({
			filename: path.join(__dirname, '..', '..', 'logs', `%DATE%.log`),
			datePattern: 'YYYY-MM-DD',
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '14d',
			level: configService.get<string>('LOG_FILE_LEVEL'),
			json: false,
			format: format.combine(
				format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
				format.metadata({ fillExcept: ['message', 'level'] }),
				formatLogger,
			),
		});
	}
}
