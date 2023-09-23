import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ThirdPartyAuthGuard extends AuthGuard('third-party') {}
