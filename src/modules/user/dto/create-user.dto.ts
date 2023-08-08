import { PartialType } from '@nestjs/swagger';
import { User } from '@entities';

export class CreateUserDto extends PartialType(User) {}
