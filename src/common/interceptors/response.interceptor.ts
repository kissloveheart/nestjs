import { Response } from '@/types/common.type';
import { RESPONSE_MESSAGE } from '@/constant';
import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
	constructor(private reflector: Reflector) {}

	intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<Response<T>> {
		return next.handle().pipe(
			map((data) => ({
				code: context.switchToHttp().getResponse().statusCode,
				message:
					this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler()) ||
					'success',
				data,
			})),
		);
	}
}
