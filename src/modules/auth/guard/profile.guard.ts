import { PROFILE_TOKEN } from '@constant';
import { ProfileService } from '@modules/profile';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class ProfileGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => ProfileService))
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
