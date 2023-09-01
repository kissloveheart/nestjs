import { SKIP_AUTH } from '@constant';
import { ExecutionContext } from '@nestjs/common';
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
