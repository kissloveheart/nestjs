import { RoleName, UserStatus } from '@enum';
import { MigrationInterface } from 'typeorm';
import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';
import { hashPin } from '@utils';

export class SeedUser1692066221729 implements MigrationInterface {
  public async up(queryRunner: MongoQueryRunner): Promise<void> {
    if (process.env.SUFFIX_ENV_NAME !== 'local') return;
    const { salt, hash } = await hashPin('1234');

    await queryRunner.insertMany('user', [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'hiep.nguyenvan1@ncc.asia',
        phoneNumber: '1234567890',
        status: UserStatus.ACTIVE,
        role: RoleName.ADMIN,
        endSessionDate: new Date(),
        otp: {
          code: '123456',
          createdDate: new Date(),
          attempts: 0,
          consumed: false,
        },
        securityInformation: {
          pin: hash,
          salt,
          pinUpdatedDate: new Date(),
          failedPinCount: 0,
          securityQuestion: 'What is your favorite color?',
          securityAnswer: 'Blue',
          failedSecurityQuestionCount: 0,
        },
      },
      {
        firstName: 'Dai',
        lastName: 'Pham',
        email: 'dai.phamgiabao@ncc.asia',
        phoneNumber: '1234567890',
        status: UserStatus.ACTIVE,
        role: RoleName.ADMIN,
        endSessionDate: new Date(),
        otp: {
          code: '123456',
          createdDate: new Date(),
          attempts: 0,
          consumed: false,
        },
        securityInformation: {
          pin: hash,
          salt,
          pinUpdatedDate: new Date(),
          failedPinCount: 0,
          securityQuestion: 'What is your favorite color?',
          securityAnswer: 'Blue',
          failedSecurityQuestionCount: 0,
        },
      },
      {
        firstName: 'Y',
        lastName: 'Le',
        email: 'y.levan@ncc.asia',
        phoneNumber: '1234567890',
        status: UserStatus.ACTIVE,
        role: RoleName.ADMIN,
        endSessionDate: new Date(),
        otp: {
          code: '123456',
          createdDate: new Date(),
          attempts: 0,
          consumed: false,
        },
        securityInformation: {
          pin: hash,
          salt,
          pinUpdatedDate: new Date(),
          failedPinCount: 0,
          securityQuestion: 'What is your favorite color?',
          securityAnswer: 'Blue',
          failedSecurityQuestionCount: 0,
        },
      },
      {
        firstName: 'Long',
        lastName: 'Tran',
        email: 'long.tranphi@ncc.asia',
        phoneNumber: '1234567890',
        status: UserStatus.ACTIVE,
        role: RoleName.ADMIN,
        endSessionDate: new Date(),
        otp: {
          code: '123456',
          createdDate: new Date(),
          attempts: 0,
          consumed: false,
        },
        securityInformation: {
          pin: hash,
          salt,
          pinUpdatedDate: new Date(),
          failedPinCount: 0,
          securityQuestion: 'What is your favorite color?',
          securityAnswer: 'Blue',
          failedSecurityQuestionCount: 0,
        },
      },
      {
        firstName: 'Khanh',
        lastName: 'Hua',
        email: 'khanh.huatranthuy@ncc.asia',
        phoneNumber: '1234567890',
        status: UserStatus.ACTIVE,
        role: RoleName.ADMIN,
        endSessionDate: new Date(),
        otp: {
          code: '123456',
          createdDate: new Date(),
          attempts: 0,
          consumed: false,
        },
        securityInformation: {
          pin: hash,
          salt,
          pinUpdatedDate: new Date(),
          failedPinCount: 0,
          securityQuestion: 'What is your favorite color?',
          securityAnswer: 'Blue',
          failedSecurityQuestionCount: 0,
        },
      },
    ]);
  }

  public async down(queryRunner: MongoQueryRunner): Promise<void> {}
}
