import { CardType } from '@enum';
import { faker } from '@faker-js/faker';
import { SaveMedicationDto } from '@modules/card/dto/medication.dto';
import { BasicInformation, Profile } from '@modules/profile';
import { Topic, TopicPayload } from '@modules/topic';
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
createMedicationPayload._id = new ObjectId('6500113c1895a06e02ab3d28');
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
    prescription: [
      {
        prescription: true,
        takeAsNeeded: false,
        fill: [
          {
            fillDate: faker.date.birthdate(),
            daySupply: faker.number.int(),
            ofFills: faker.number.int(),
            cost: faker.commerce.price(),
            location: faker.location.city(),
          },
        ],
      },
    ],
    topics: [new ObjectId('650156e338b8a56d37856602')],
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
    prescription: [
      {
        prescription: true,
        takeAsNeeded: false,
        fill: [
          {
            fillDate: faker.date.birthdate(),
            daySupply: faker.number.int(),
            ofFills: faker.number.int(),
            cost: faker.commerce.price(),
            location: faker.location.city(),
          },
        ],
      },
    ],
    topics: [new ObjectId('650156e338b8a56d37856603')],
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
    prescription: [
      {
        prescription: true,
        takeAsNeeded: false,
        fill: [
          {
            fillDate: faker.date.birthdate(),
            daySupply: faker.number.int(),
            ofFills: faker.number.int(),
            cost: faker.commerce.price(),
            location: faker.location.city(),
          },
        ],
      },
    ],
    topics: [new ObjectId('650156e338b8a56d32856609')],
  },
];

export const topicData = [
  {
    _id: new ObjectId('650156e338b8a56d32856609'),
    deletedTime: null,
    title: faker.lorem.sentence,
    isLinked: true,
  },
  {
    _id: new ObjectId('650156e338b8a56d37856603'),
    deletedTime: null,
    title: faker.lorem.sentence,
    isLinked: true,
  },
  {
    _id: new ObjectId('650156e338b8a56d37856602'),
    deletedTime: null,
    title: faker.lorem.sentence,
    isLinked: true,
  },
];
const topic = new Topic();
topic._id = new ObjectId('650156e338b8a56d37856602');

export const topicPayload: TopicPayload = new TopicPayload();
topicPayload.topics = [topic];

const topicNotExist = new Topic();
topic._id = new ObjectId();

export const topicNotExistPayload: TopicPayload = new TopicPayload();
topicPayload.topics = [topicNotExist];
