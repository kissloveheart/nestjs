import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { User, UserSchemaFactory } from '@/modules/users/entities/user.entity';
import {
	FlashCard,
	FlashCardSchema,
} from '@/modules/flash-cards/entities/flash-card.entity';
import {
	Collection,
	CollectionSchema,
} from '@/modules/collection/entities/collection.entity';
import { UsersRepository } from '@/repositories/users.repository';
import { UserRolesModule } from '@/modules/user-roles/user-roles.module';

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: User.name,
				imports: [
					MongooseModule.forFeature([
						{ name: FlashCard.name, schema: FlashCardSchema },
						{ name: Collection.name, schema: CollectionSchema },
					]),
				],
				inject: [getModelToken(FlashCard.name), getModelToken(Collection.name)],
				useFactory: UserSchemaFactory,
			},
		]),
		UserRolesModule,
	],
	controllers: [UsersController],
	providers: [UsersService, UsersRepository],
	exports: [UsersService],
})
export class UsersModule {}
