import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { USER_TOKEN } from '@constant';

@Injectable()
export class UserInterceptor implements NestInterceptor {
	constructor(private readonly cls: ClsService) {}

	intercept(context: ExecutionContext, next: CallHandler) {
		const request = context.switchToHttp().getRequest();
		this.cls.set(USER_TOKEN, request.user);
		return next.handle();
	}
}
