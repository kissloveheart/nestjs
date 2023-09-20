import { CardType } from '@enum';
import { faker } from '@faker-js/faker';
import { SaveAppointmentDto } from '@modules/card/dto/appointment.dto';
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

export const appointmentPayload = new SaveAppointmentDto();
appointmentPayload._id = new ObjectId('6500113c1895a06e02ab3d87');
appointmentPayload.isFollowedUp = true;
appointmentPayload.location = faker.location.streetAddress();
appointmentPayload.title = faker.animal.bird();

export const createAppointmentPayload = new SaveAppointmentDto();
createAppointmentPayload._id = new ObjectId('6500113c1895a06e02ab3d88');
createAppointmentPayload.isFollowedUp = true;
createAppointmentPayload.title = faker.animal.bird();
createAppointmentPayload.location = faker.location.streetAddress();

export const appointmentData = [
  {
    _id: new ObjectId('6500113c1895a06e02ab3d87'),
    title: faker.animal.bird(),
    cardType: CardType.APPOINTMENTS,
    location: faker.location.streetAddress(),
    profile: new ObjectId('650156e338b8a56d37856611'),
    isFollowedUp: false,
    startTime: new Date(),
    endTime: new Date(),
  },
  {
    _id: new ObjectId('650156e338b8a56d37856604'),
    title: faker.animal.bird(),
    location: faker.location.streetAddress(),
    cardType: CardType.APPOINTMENTS,
    profile: new ObjectId('650156e338b8a56d37856611'),
    isFollowedUp: false,
    startTime: new Date(),
    endTime: new Date(),
  },
  {
    _id: new ObjectId('650156e338b8a56d37856605'),
    title: faker.animal.bird(),
    location: faker.location.streetAddress(),
    cardType: CardType.APPOINTMENTS,
    profile: new ObjectId('650156e338b8a56d37856611'),
    isFollowedUp: false,
    updatedTime: new Date(),
    startTime: new Date(),
    endTime: new Date(),
  },
];
