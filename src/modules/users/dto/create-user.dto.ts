import { PartialType } from '@nestjs/swagger';
import { User } from '@/modules/users/entities/user.entity';

export class CreateUserDto extends PartialType(User) {}
