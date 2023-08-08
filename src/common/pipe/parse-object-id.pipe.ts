import {
	ArgumentMetadata,
	BadRequestException,
	Injectable,
	PipeTransform,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, ObjectId> {
	transform(value: string, metadata: ArgumentMetadata) {
		const validObjectId = ObjectId.isValid(value);

		if (!validObjectId) {
			throw new BadRequestException('Invalid ObjectId');
		}

		return new ObjectId(value);
	}
}
