import {
	CallHandler,
	ExecutionContext,
	HttpException,
	Injectable,
	Logger,
	NestInterceptor,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable, catchError, of, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { IResponse } from '@types';
import { Request } from 'express';
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
				if (!(err instanceof HttpException)) {
					this.log.error(err);
				}
				const errorResponse: IResponse<null> = {
					code: typeof err.getStatus === 'function' ? err.getStatus() : 500,
					message: err.message ?? 'Internal server error',
					success: false,
					data: null,
					path: context.switchToHttp().getRequest<Request>().url,
					timestamp: new Date(),
				};
				return of(errorResponse);
			}),
		);
	}
}
