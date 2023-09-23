import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Profile } from '../entity/profile.entity';

export class SaveProfileDto extends OmitType(Profile, [
  'acl',
  'avatar',
  'owner',
] as const) {}

export class SyncProfileDto extends OmitType(Profile, [
  'updatedTime',
  'deletedTime',
  'createdTime',
]) {
  @ApiProperty()
  updatedTime: Date;

  @ApiProperty()
  deletedTime: Date;

  @ApiProperty()
  createdTime?: Date;

  constructor(partial: Partial<Profile>) {
    super();
    Object.assign(this, partial);
  }
}
