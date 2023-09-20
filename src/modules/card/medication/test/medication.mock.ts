import { CardType } from '@enum';
import { faker } from '@faker-js/faker';
import { SaveMedicationDto } from '@modules/card/dto/medication.dto';
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

export const medicationPayload = new SaveMedicationDto();
medicationPayload._id = new ObjectId('6500113c1895a06e02ab3d87');
medicationPayload.isFollowedUp = true;
medicationPayload.instruction = faker.lorem.sentence();
medicationPayload.title = faker.animal.bird();

export const createMedicationPayload = new SaveMedicationDto();
createMedicationPayload._id = new ObjectId('6500113c1895a06e02ab3d88');
createMedicationPayload.isFollowedUp = true;
createMedicationPayload.instruction = faker.lorem.sentence();
createMedicationPayload.title = faker.animal.bird();

export const medicationData = [
  {
    _id: new ObjectId('6500113c1895a06e02ab3d87'),
    title: faker.animal.bird(),
    cardType: CardType.MEDICATIONS,
    instruction: faker.lorem.sentence(),
    profile: new ObjectId('650156e338b8a56d37856611'),
    isFollowedUp: false,
    startTime: new Date(),
    endTime: new Date(),
  },
  {
    _id: new ObjectId('650156e338b8a56d37856604'),
    title: faker.animal.bird(),
    cardType: CardType.MEDICATIONS,
    instruction: faker.lorem.sentence(),
    profile: new ObjectId('650156e338b8a56d37856611'),
    isFollowedUp: false,
    startTime: new Date(),
    endTime: new Date(),
  },
  {
    _id: new ObjectId('650156e338b8a56d37856605'),
    title: faker.animal.bird(),
    cardType: CardType.MEDICATIONS,
    instruction: faker.lorem.sentence(),
    profile: new ObjectId('650156e338b8a56d37856611'),
    isFollowedUp: false,
    updatedTime: new Date(),
    startTime: new Date(),
    endTime: new Date(),
  },
];
