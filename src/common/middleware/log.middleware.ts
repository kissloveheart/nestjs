import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LogMiddleware implements NestMiddleware {
	private readonly log = new Logger('HTTP');

	use(request: Request, response: Response, next: NextFunction) {
		const startAt = process.hrtime();
		const { method, originalUrl } = request;
		response.on('finish', () => {
			const { statusCode } = response;
			const contentLength = response.get('content-length');
			const diff = process.hrtime(startAt);
			const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
			this.log.log(`${method} ${originalUrl} ${statusCode} ${responseTime}ms`);
		});

		next();
	}
}
