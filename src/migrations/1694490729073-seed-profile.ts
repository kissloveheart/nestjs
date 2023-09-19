import { ObjectId } from 'mongodb';
import { MigrationInterface } from 'typeorm';
import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';
import {
  BasicInformation,
  EmergencyContact,
  HealthDetail,
  Profile,
} from '@modules/profile';
import {
  AllergySeverity,
  AllergyType,
  BloodType,
  CardType,
  Pronouns,
  Sex,
} from '@enum';
import { faker } from '@faker-js/faker';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Note } from '../modules/card/entity/child-entity/note.entity';
import { Allergy } from '../modules/card/entity/child-entity/allergy.entity';
import { AllergyService } from '../modules/card/allergy/allergy.service';

export class SeedProfile1694490729073 implements MigrationInterface {
  public async up(queryRunner: MongoQueryRunner): Promise<void> {
    // if (process.env.SUFFIX_ENV_NAME !== 'local') return;
    const profilesToInsert = [];
    for (let i = 1; i <= 100; i++) {
      const profile = plainToClass(Profile, {
        owner: new ObjectId(), // Replace with the owner's ObjectId
        basicInformation: plainToClass(BasicInformation, {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          birthDate: faker.date.birthdate(),
          pronouns: Pronouns.HE,
          sex: Sex.MALE,
          SSN: '123-45-6789',
        }),
        healthDetail: plainToClass(HealthDetail, {
          height: '175 cm',
          weight: '70 kg',
          bloodType: BloodType.A_POSITIVE,
          isOrganDonor: true,
        }),
        emergencyContacts: [
          plainToClass(EmergencyContact, {
            _id: new ObjectId(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            phoneNumber: faker.phone.number(),
          }),
        ],
        avatar: faker.image.avatar(),
      });
      profilesToInsert.push(profile);
    }
    await queryRunner.insertMany('profile', profilesToInsert);

    const profiles = queryRunner.cursor('profile', {}).project({
      _id: 1,
    });
    while (await profiles.hasNext()) {
      const profile = await profiles.next();
      const notes = [];
      for (let j = 1; j <= 100; j++) {
        const note = plainToClass(Note, {
          title: faker.animal.bird(),
          cardType: CardType.NOTES,
          startTime: new Date(),
          description: faker.person.jobDescriptor(),
        });
        note.profile = profile._id;
        notes.push(note);
      }
      await queryRunner.insertMany('card', notes);

      const allergies = [];
      for (let j = 1; j <= 100; j++) {
        const allergy = plainToClass(Allergy, {
          title: faker.animal.bird(),
          cardType: CardType.ALLERGIES,
          startTime: new Date(),
          description: faker.person.jobDescriptor(),
          type: AllergyType.FOOD,
          allergySeverity: AllergySeverity.MILD,
        });
        allergy.profile = profile._id;
        allergies.push(allergy);
      }
      await queryRunner.insertMany('card', allergies);
    }
  }

  public async down(queryRunner: MongoQueryRunner): Promise<void> {}
}
