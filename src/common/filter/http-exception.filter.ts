import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IResponse } from '@types';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const errorResponse: IResponse<null> = {
      code: exception.getStatus(),
      message: exception.message,
      success: false,
      data: null,
      path: request.url,
      timestamp: new Date(),
    };

    response.status(exception.getStatus()).json(errorResponse);
  }
}
