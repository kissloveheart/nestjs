import { ROLE_KEY, SKIP_AUTH } from '@constant';
import { RoleName } from '@enum';
import { SetMetadata } from '@nestjs/common';

export const RequiredRole = (role: RoleName) => SetMetadata(ROLE_KEY, role);

export const Public = () => SetMetadata(SKIP_AUTH, true);
