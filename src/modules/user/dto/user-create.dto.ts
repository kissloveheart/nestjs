import { PartialType } from '@nestjs/swagger';
import { UserEntity } from './user.entity';

export class UserCreateDto extends PartialType(UserEntity) {}
