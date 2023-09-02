import { UserEntity, UserService } from '@modules/user';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { LoginDto } from '../dto/auth.dto';

@Injectable()
export class OTPStrategy extends PassportStrategy(Strategy, 'otp') {
  constructor(private readonly userService: UserService) {
    super();
  }

  async validate(req: Request): Promise<UserEntity> {
    const code = req.query.code as string;
    const error = await validate(plainToClass(LoginDto, { code }));
    if (error.length > 0) {
      throw new BadRequestException(
        JSON.stringify(
          error.map((err) => Object.values(err.constraints).join(', ')),
        ),
      );
    }
    const user = await this.userService.verifyOTP(code);
    return user;
  }
}
