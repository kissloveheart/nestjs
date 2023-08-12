import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './http-exception.filter';
import { Module } from '@nestjs/common';
import { TypeormExceptionFilter } from './typeorm-exception.filter';

@Module({
	providers: [
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
		{
			provide: APP_FILTER,
			useClass: TypeormExceptionFilter,
		},
	],
})
export class FilterModule {}
