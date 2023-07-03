import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from '@/repositories/base/base.abstract.repository';
import { User } from '@/modules/users/entities/user.entity';

@Injectable()
export class UsersRepository extends BaseRepositoryAbstract<User> {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
	) {
		super(userModel);
	}
}
