import { ROLE_KEY } from '@constant';
import { RoleName } from '@enum';
import { User } from '@modules/user';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isPublicRequest } from './auth.utils';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (isPublicRequest(this.reflector, context)) {
      return true;
    }

    const requiredRole = this.reflector.getAllAndOverride<RoleName>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRole) return true;

    const { user }: { user: User } = context.switchToHttp().getRequest();

    if (user.role === RoleName.ADMIN) {
      return true;
    }

    return requiredRole === user.role;
  }
}
