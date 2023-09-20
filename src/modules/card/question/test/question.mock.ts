import { CardType } from '@enum';
import { faker } from '@faker-js/faker';
import { SaveQuestionDto } from '@modules/card/dto/question.dto';
import { BasicInformation, Profile } from '@modules/profile';
import { OrderDirection, PageRequest, PageRequestSync } from '@types';
import { ObjectId } from 'mongodb';

export const mockProfile: Profile = {
  owner: new ObjectId(),
  basicInformation: new BasicInformation(),
  _id: new ObjectId('650156e338b8a56d37856611'),
};

export const mockPageRequest: PageRequest = {
  page: 1,
  size: 10,
  skip: 0,
  order: OrderDirection.ASC,
  orderBy: 'createdAt',
};

export const mockPageRequestSync: PageRequestSync = new PageRequestSync();
mockPageRequestSync.page = 1;
mockPageRequestSync.size = 10;
mockPageRequestSync.order = OrderDirection.ASC;
mockPageRequestSync.orderBy = 'createdAt';
mockPageRequestSync.lastSyncTime = new Date(new Date().getTime() - 10 * 60000);

export const questionPayload = new SaveQuestionDto();
questionPayload._id = new ObjectId('6500113c1895a06e02ab3d87');
questionPayload.isFollowedUp = true;
questionPayload.title = faker.animal.bird();

export const createQuestionPayload = new SaveQuestionDto();
createQuestionPayload._id = new ObjectId('6500113c1895a06e02ab3d88');
createQuestionPayload.isFollowedUp = true;
createQuestionPayload.title = faker.animal.bird();

export const questionData = [
  {
    _id: new ObjectId('6500113c1895a06e02ab3d87'),
    title: faker.animal.bird(),
    cardType: CardType.QUESTIONS,
    profile: new ObjectId('650156e338b8a56d37856611'),
    isFollowedUp: false,
    startTime: new Date(),
    endTime: new Date(),
  },
  {
    _id: new ObjectId('650156e338b8a56d37856604'),
    title: faker.animal.bird(),
    cardType: CardType.QUESTIONS,
    profile: new ObjectId('650156e338b8a56d37856611'),
    isFollowedUp: false,
    startTime: new Date(),
    endTime: new Date(),
  },
  {
    _id: new ObjectId('650156e338b8a56d37856605'),
    title: faker.animal.bird(),
    cardType: CardType.QUESTIONS,
    profile: new ObjectId('650156e338b8a56d37856611'),
    isFollowedUp: false,
    updatedTime: new Date(),
    startTime: new Date(),
    endTime: new Date(),
  },
];
