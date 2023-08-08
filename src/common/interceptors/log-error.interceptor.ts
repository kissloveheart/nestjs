import {
	CallHandler,
	ExecutionContext,
	HttpException,
	Injectable,
	Logger,
	NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { TypeORMError } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LogErrorInterceptor implements NestInterceptor {
	private readonly log = new Logger(LogErrorInterceptor.name);
	constructor(private readonly cls: ClsService) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		this.cls.set('requestId', uuidv4());
		return next.handle().pipe(
			catchError((err) => {
				this.cls.set('error', err);
				if (!(err instanceof HttpException)) {
					this.log.error(err);
				}
				throw err;
			}),
		);
	}
}
