import { Public } from '@decorators';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClsService } from 'nestjs-cls';
import { ProfileGuard } from '@guard';

@Controller('profile/:profileId/card')
@ApiTags('Card')
@Public()
@UseGuards(ProfileGuard)
export class CardController {
  constructor(private readonly cls: ClsService) {}
}
