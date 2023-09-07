import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumberString, IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNumberString()
  @Length(6, 6)
  code: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;
}
