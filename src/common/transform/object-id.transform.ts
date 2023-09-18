import { isString } from 'class-validator';
import { ObjectId } from 'mongodb';

export const objectIdTransform = (value: unknown) => {
  if (value instanceof ObjectId) {
    return value;
  }

  if (isString(value) && ObjectId.isValid(value)) {
    return new ObjectId(value);
  }

  return null;
};
