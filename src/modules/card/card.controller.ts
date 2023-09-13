import { Public } from '@decorators';
import { ProfileGuard } from '@guard';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClsService } from 'nestjs-cls';

@Controller('profile/:profileId/card')
@ApiTags('Card')
@Public()
@UseGuards(ProfileGuard)
export class CardController {
  constructor(private readonly cls: ClsService) {}
}
