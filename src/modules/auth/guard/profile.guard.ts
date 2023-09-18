import { ProfileService } from '@modules/profile';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { ClsService } from 'nestjs-cls';
import { PROFILE_TOKEN } from '@constant';
import { ObjectId } from 'mongodb';

@Injectable()
export class ProfileGuard implements CanActivate {
  constructor(
    private readonly profileService: ProfileService,
    private readonly cls: ClsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const profileId = request.params.profileId;
    if (!ObjectId.isValid(profileId))
      throw new BadRequestException(`Invalid profile id ${profileId}`);
    const profile = await this.profileService.findProfileWithOutDeletedTimeNull(
      new ObjectId(profileId),
    );
    this.cls.set(PROFILE_TOKEN, profile);
    return true;
  }
}
