import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { ThirdPartyLogin } from '@enum';
import { getEnumKeyByValue } from '@utils';
import { AuthService } from '../auth.service';

@Injectable()
export class ThirdPartyStrategy extends PassportStrategy(
  Strategy,
  'third-party',
) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<boolean> {
    const token = req.query.token as string;
    const type = req.query.type as string;
    if (!token || !type)
      throw new BadRequestException(
        'Request must be have token and third party',
      );

    const thirdParty = getEnumKeyByValue(ThirdPartyLogin, type);

    const payload = await this.authService.verifyThirdPartyToken(
      thirdParty,
      token,
    );

    req.email = payload.email;
    return true;
  }
}
