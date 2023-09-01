import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isEmail } from 'class-validator';

@Injectable()
export class EmailValidation implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!isEmail(value)) {
      throw new BadRequestException(`Malformed email: ${value}`);
    }

    return value;
  }
}
