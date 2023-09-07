import { PartialType } from '@nestjs/swagger';
import { Profile } from '../entity/Profile.entity';

export class ProfileCreateDto extends PartialType(Profile) {}

export class ProfileDtoUpdateDto extends PartialType(ProfileCreateDto) {}
