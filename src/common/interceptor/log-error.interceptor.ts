import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable, catchError, of, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { IResponse } from '@types';
import { Request, Response } from 'express';
import { LogService } from '@log';

@Injectable()
export class LogErrorInterceptor implements NestInterceptor {
  constructor(
    private readonly cls: ClsService,
    private readonly log: LogService,
  ) {
    this.log.setContext(LogErrorInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.cls.set('requestId', uuidv4());
    return next.handle().pipe(
      catchError((err) => {
        let code = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = err.message ?? 'Internal server error';

        if (err instanceof HttpException) {
          message =
            typeof err.getResponse() === 'object'
              ? err.getResponse()['message'] ?? err.getResponse()
              : err.getResponse();
          code = err.getStatus();
        } else {
          this.log.error(err);
        }

        const errorResponse: IResponse<null> = {
          code,
          message,
          success: false,
          data: null,
          path: context.switchToHttp().getRequest<Request>().url,
          timestamp: new Date(),
        };

        context.switchToHttp().getResponse<Response>().status(code);
        return of(errorResponse);
      }),
    );
  }
}
