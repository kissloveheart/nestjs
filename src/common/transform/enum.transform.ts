import { BadRequestException } from '@nestjs/common';
import { isNumber, isString } from 'class-validator';

export function enumTransform<T extends Record<string, string | number>>(
  value: string | number,
  enumName: T,
) {
  if (!value) return undefined;
  if (value in enumName) {
    if (isNumber(Number(value))) return Number(value);
    if (isString(value)) return enumName[value as keyof typeof enumName];
  }

  if (Object.values(enumName).includes(value)) {
    return value;
  }
  throw new BadRequestException(`Invalid value of enum: ${value}`);
}
