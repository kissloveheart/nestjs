import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '@/filter/interface/error-response.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();
		const message: ErrorResponse = {
			detail: exception.getResponse(),
			path: request.url,
			timestamp: new Date().toISOString(),
		};

		response.status(status).json(message);
	}
}
