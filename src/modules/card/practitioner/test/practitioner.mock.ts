import { CardType } from '@enum';
import { faker } from '@faker-js/faker';
import { SavePractitionerDto } from '@modules/card/dto/practitioner.dto';
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

export const practitionerPayload = new SavePractitionerDto();
practitionerPayload._id = new ObjectId('6500113c1895a06e02ab3d87');
practitionerPayload.isFollowedUp = true;
practitionerPayload.title = faker.animal.bird();
practitionerPayload.phone = faker.phone.number();

export const createPractitionerPayload = new SavePractitionerDto();
createPractitionerPayload._id = new ObjectId('6500113c1895a06e02ab3d88');
createPractitionerPayload.isFollowedUp = true;
createPractitionerPayload.phone = faker.phone.number();
createPractitionerPayload.title = faker.animal.bird();

export const practitionerData = [
  {
    _id: new ObjectId('6500113c1895a06e02ab3d87'),
    title: faker.animal.bird(),
    cardType: CardType.PRACTITIONERS,
    phone: faker.phone.number(),
    profile: new ObjectId('650156e338b8a56d37856611'),
    isFollowedUp: false,
    startTime: new Date(),
    endTime: new Date(),
  },
  {
    _id: new ObjectId('650156e338b8a56d37856604'),
    isNoLongerExperiencing: false,
    title: faker.animal.bird(),
    cardType: CardType.PRACTITIONERS,
    phone: faker.phone.number(),
    profile: new ObjectId('650156e338b8a56d37856611'),
    isFollowedUp: false,
    startTime: new Date(),
    endTime: new Date(),
  },
  {
    _id: new ObjectId('650156e338b8a56d37856605'),
    isNoLongerExperiencing: false,
    title: faker.animal.bird(),
    cardType: CardType.PRACTITIONERS,
    phone: faker.phone.number(),
    profile: new ObjectId('650156e338b8a56d37856611'),
    isFollowedUp: false,
    updatedTime: new Date(),
    startTime: new Date(),
    endTime: new Date(),
  },
];
