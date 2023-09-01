import { PartialType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UserCreateDto extends PartialType(UserEntity) {}
