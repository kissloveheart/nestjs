import * as mongoose from 'mongoose';
import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
} from '@nestjs/common';
import { ErrorResponse } from '@/filter/interface/error-response.interface';
import { LoggerService } from '@/logger/logger.service';
import { MongoServerError } from 'mongodb';

@Catch(mongoose.mongo.MongoServerError)
export class MongooseExceptionFilter implements ExceptionFilter {
	constructor(private readonly log: LoggerService) {
		this.log.setContext(MongooseExceptionFilter.name);
	}
	catch(exception: MongoServerError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const request = ctx.getRequest();
		const message: ErrorResponse = {
			detail: exception.message,
			path: request.url,
			timestamp: new Date().toISOString(),
		};
		this.log.error(exception.message);
		response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(message);
	}
}
