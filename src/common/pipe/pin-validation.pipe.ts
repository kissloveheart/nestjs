import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { length, isNumberString } from 'class-validator';

@Injectable()
export class PinValidation implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!isNumberString(value) || !length(value, 4, 4)) {
      throw new BadRequestException(`Malformed pin: ${value}`);
    }

    return value;
  }
}
