import { PROFILE_TOKEN } from '@constant';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { ClsService } from 'nestjs-cls';
import { Strategy } from 'passport-custom';
import { ProfileService } from '../profile.service';

@Injectable()
export class ProfileStrategy extends PassportStrategy(Strategy, 'profile') {
  constructor(
    private readonly profileService: ProfileService,
    private readonly cls: ClsService,
  ) {
    super();
  }

  async validate(request: Request): Promise<boolean> {
    const profileId = request.params.profileId;
    if (!ObjectId.isValid(profileId))
      throw new NotFoundException(`Profile id ${profileId} does not exist`);
    const profile = await this.profileService.findProfileWithOutDeletedTimeNull(
      new ObjectId(profileId),
    );
    this.cls.set(PROFILE_TOKEN, profile);
    return true;
  }
}
