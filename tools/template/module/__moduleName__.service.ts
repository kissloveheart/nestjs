import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseService } from '@shared/base';
import { __moduleName__CamelCase__Entity } from './dto/__moduleName__.entity';

@Injectable()
export class __moduleName__CamelCase__Service extends BaseService<__moduleName__CamelCase__Entity> {
	constructor(
		@InjectRepository(__moduleName__CamelCase__Entity)
		private readonly userRepository: MongoRepository<__moduleName__CamelCase__Entity>,
	) {
		super(userRepository);
	}
}
