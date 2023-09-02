import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UserCreateDto extends PickType(UserEntity, [
  'lastName',
  'firstName',
  'email',
  'phoneNumber',
  'ageAccepted',
  'termsAccepted',
] as const) {}
