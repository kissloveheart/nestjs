import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
} from '@nestjs/common';
import {
	CannotCreateEntityIdMapError,
	EntityNotFoundError,
	QueryFailedError,
	TypeORMError,
} from 'typeorm';
import { Request, Response } from 'express';

@Catch(
	QueryFailedError,
	EntityNotFoundError,
	CannotCreateEntityIdMapError,
	TypeORMError,
)
export class TypeormExceptionFilter implements ExceptionFilter {
	catch(exception: TypeORMError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const message = (exception as TypeORMError).message;

		response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
			detail: message,
			path: request.url,
			timestamp: new Date().toISOString(),
		});
	}
}
