import { BadRequestException } from '@nestjs/common';
import { isNumber, isString } from 'class-validator';

export function enumTransform<T extends object>(
	value: string | number,
	enumName: T,
	throwException = true,
) {
	if (!value) return undefined;
	if (value in enumName) {
		if (isNumber(Number(value))) return Number(value);
		if (isString(value)) return enumName[value as keyof typeof enumName];
	}

	if (throwException) {
		throw new BadRequestException(`Invalid value of enum: ${value}`);
	}
}
