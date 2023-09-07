import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserCreateDto extends PickType(User, [
  'lastName',
  'firstName',
  'email',
  'phoneNumber',
  'ageAccepted',
  'termsAccepted',
] as const) {}
