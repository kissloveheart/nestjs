import { ObjectId } from 'mongodb';
import { MigrationInterface } from 'typeorm';
import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';
import {
  BasicInformation,
  EmergencyContact,
  HealthDetail,
  Profile,
} from '@modules/profile';
import { BloodType, Pronouns, Sex } from '@enum';
import { faker } from '@faker-js/faker';
import { plainToInstance } from 'class-transformer';

export class SeedProfile1694490729073 implements MigrationInterface {
  public async up(queryRunner: MongoQueryRunner): Promise<void> {
    const profilesToInsert = [];
    for (let i = 1; i <= 1000; i++) {
      const profile = plainToInstance(Profile, {
        owner: new ObjectId(i), // Replace with the owner's ObjectId
        basicInformation: plainToInstance(BasicInformation, {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          birthDate: faker.date.birthdate(),
          pronouns: Pronouns.HE,
          sex: Sex.MALE,
          SSN: '123-45-6789',
        }),
        healthDetail: plainToInstance(HealthDetail, {
          height: '175 cm',
          weight: '70 kg',
          bloodType: BloodType.A_POSITIVE,
          isOrganDonor: true,
        }),
        emergencyContacts: [
          plainToInstance(EmergencyContact, {
            _id: new ObjectId(i),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            phoneNumber: faker.phone.number(),
          }),
        ],
        avatar: faker.image.avatar(),
      });
      profilesToInsert.push(profile);
    }
    await queryRunner.insertMany('profile', profilesToInsert, {
      forceServerObjectId: true,
    });
  }

  public async down(queryRunner: MongoQueryRunner): Promise<void> {}
}
