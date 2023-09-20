import { CardType } from '@enum';
import { faker } from '@faker-js/faker';
import { SaveConditionDto } from '@modules/card/dto/condition.dto';
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

export const conditionPayload = new SaveConditionDto();
conditionPayload._id = new ObjectId('6500113c1895a06e02ab3d87');
conditionPayload.isFollowedUp = true;
conditionPayload.title = faker.animal.bird();
conditionPayload.description = faker.lorem.sentence();

export const createConditionPayload = new SaveConditionDto();
createConditionPayload._id = new ObjectId('6500113c1895a06e02ab3d88');
createConditionPayload.isFollowedUp = true;
createConditionPayload.description = faker.lorem.sentence();
createConditionPayload.title = faker.animal.bird();

export const conditionData = [
  {
    _id: new ObjectId('6500113c1895a06e02ab3d87'),
    isNoLongerExperiencing: false,
    title: faker.animal.bird(),
    cardType: CardType.CONDITIONS,
    description: faker.lorem.sentence(),
    profile: new ObjectId('650156e338b8a56d37856611'),
    isFollowedUp: false,
    startTime: new Date(),
    endTime: new Date(),
  },
  {
    _id: new ObjectId('650156e338b8a56d37856604'),
    isNoLongerExperiencing: false,
    title: faker.animal.bird(),
    cardType: CardType.CONDITIONS,
    description: faker.lorem.sentence(),
    profile: new ObjectId('650156e338b8a56d37856611'),
    isFollowedUp: false,
    startTime: new Date(),
    endTime: new Date(),
  },
  {
    _id: new ObjectId('650156e338b8a56d37856605'),
    isNoLongerExperiencing: false,
    title: faker.animal.bird(),
    cardType: CardType.CONDITIONS,
    description: faker.lorem.sentence(),
    profile: new ObjectId('650156e338b8a56d37856611'),
    isFollowedUp: false,
    updatedTime: new Date(),
    startTime: new Date(),
    endTime: new Date(),
  },
];
