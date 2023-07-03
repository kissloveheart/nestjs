import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '@/logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	constructor(private readonly log: LoggerService) {
		this.log.setContext('HTTP');
	}

	use(request: Request, response: Response, next: NextFunction) {
		const startAt = process.hrtime();
		const { method, originalUrl } = request;
		response.on('finish', () => {
			const { statusCode } = response;
			const contentLength = response.get('content-length');
			const diff = process.hrtime(startAt);
			const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
			this.log.info(
				`${method} ${originalUrl} ${statusCode} ${responseTime}ms ${contentLength}`,
			);
		});

		next();
	}
}
