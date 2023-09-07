import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProfileService } from './Profile.service';

@Controller('Profile')
@ApiTags('Profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
}
