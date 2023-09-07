import { PickType } from '@nestjs/swagger';
import { User } from '../entity/user.entity';

export class UserCreateDto extends PickType(User, [
  'lastName',
  'firstName',
  'email',
  'phoneNumber',
  'ageAccepted',
  'termsAccepted',
] as const) {}
