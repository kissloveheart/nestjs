import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumberString, IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNumberString()
  @Length(6, 6)
  code: string;

  @ApiProperty({
    examples: {
      'hiep.nguyenvan1@ncc.asia': {
        value: 'hiep.nguyenvan1@ncc.asia',
      },
    },
  })
  @IsString()
  @IsEmail()
  email: string;
}
