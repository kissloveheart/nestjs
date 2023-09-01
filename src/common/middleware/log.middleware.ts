import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LogService } from '../log';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  constructor(private readonly log: LogService) {
    this.log.setContext('HTTP');
  }

  use(request: Request, response: Response, next: NextFunction) {
    const startAt = process.hrtime();
    const { method, baseUrl, query, body } = request;
    response.on('finish', () => {
      const { statusCode } = response;
      const diff = process.hrtime(startAt);
      const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
      this.log.info(
        `${method} ${baseUrl} ${JSON.stringify(query, null, 2)} ${
          body ? JSON.stringify(body, null, 2) : ''
        } ${statusCode} ${responseTime}ms`,
      );
    });

    next();
  }
}
