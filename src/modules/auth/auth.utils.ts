import { SKIP_AUTH, USER_HAS_BEEN_LOGGED_OUT } from '@constant';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const isPublicRequest = (
	reflector: Reflector,
	context: ExecutionContext,
) => {
	const skipAuth = reflector.getAllAndOverride<boolean>(SKIP_AUTH, [
		context.getHandler(),
		context.getClass(),
	]);

	if (skipAuth) return true;
};

export function validateIat(currentIat: number, iat: number) {
	if (currentIat === USER_HAS_BEEN_LOGGED_OUT) {
		throw new UnauthorizedException();
	}

	if (currentIat && iat <= currentIat) {
		throw new UnauthorizedException();
	}
}
