import { OmitType } from '@nestjs/swagger';
import { Profile } from '../entity/profile.entity';

export class ProfileDto extends OmitType(Profile, [
  'acl',
  'avatar',
  'owner',
] as const) {}
