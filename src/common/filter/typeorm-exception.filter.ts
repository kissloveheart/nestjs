import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { IResponse } from '@types';
import { Request, Response } from 'express';
import { MongoServerError } from 'mongodb';

@Catch(MongoServerError)
export class TypeormExceptionFilter implements ExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    Logger.error(exception.message);
    const errorResponse: IResponse<null> = {
      code: exception.code,
      message: exception.message,
      success: false,
      data: null,
      path: request.url,
      timestamp: new Date(),
    };

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
}
