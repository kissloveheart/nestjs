import { NotFoundException } from '@nestjs/common';

function getEnumKeyByValue<T>(enumObj: T, enumValue: string): T[keyof T] {
  const keys = Object.keys(enumObj) as (keyof T)[];
  for (const key of keys) {
    if (enumObj[key] === enumValue) {
      return enumObj[key];
    }
  }
  if (!keys) throw new NotFoundException(`Unknown enum ${enumValue}`);
}

export { getEnumKeyByValue };
