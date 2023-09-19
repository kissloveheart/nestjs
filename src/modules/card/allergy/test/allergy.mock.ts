import { AllergySeverity, AllergyType, CardType } from '@enum';
import { AllergyDto } from '@modules/card/dto/allergy.dto';
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

export const allergyPayload = new AllergyDto();
allergyPayload._id = new ObjectId('6500113c1895a06e02ab3d88');
allergyPayload.isFollowedUp = true;
allergyPayload.title = 'title insert';
allergyPayload.type = AllergyType.FOOD;

export const allergyData = [
  {
    _id: new ObjectId('6500113c1895a06e02ab3d87'),
    type: AllergyType.FOOD,
    allergySeverity: AllergySeverity.MILD,
    isNoLongerExperiencing: false,
    title: 'allergy title',
    cardType: CardType.ALLERGIES,
    profile: new ObjectId('650156e338b8a56d37856611'),
    isFollowedUp: false,
    startTime: new Date(),
    endTime: new Date(),
    _v: 0,
  },
  {
    _id: new ObjectId('650156e338b8a56d37856604'),
    type: AllergyType.OTHER,
    allergySeverity: AllergySeverity.MILD,
    isNoLongerExperiencing: false,
    title: 'allergy title',
    cardType: CardType.ALLERGIES,
    profile: new ObjectId('650156e338b8a56d37856611'),
    isFollowedUp: false,
    startTime: new Date(),
    endTime: new Date(),
    _v: 0,
  },
  {
    _id: new ObjectId('650156e338b8a56d37856605'),
    type: AllergyType.OTHER,
    allergySeverity: AllergySeverity.MILD,
    isNoLongerExperiencing: false,
    title: 'allergy title',
    cardType: CardType.ALLERGIES,
    profile: new ObjectId('650156e338b8a56d37856611'),
    isFollowedUp: false,
    updatedTime: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    _v: 0,
  },
];
