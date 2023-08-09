import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEmail, IsNumber } from 'class-validator';

export class LoginDto {
	@ApiProperty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsNumber()
	code: number;
}
