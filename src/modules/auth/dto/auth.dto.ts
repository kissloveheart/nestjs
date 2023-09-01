import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class EmailDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
export class LoginDto extends EmailDto {
  @ApiProperty()
  @IsString()
  @Matches('^\\d+$')
  @Length(6, 6)
  code: string;
}
