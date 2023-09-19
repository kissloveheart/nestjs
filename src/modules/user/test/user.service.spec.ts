import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { closeMongoConnection, initialTypeOrm } from '@test';
import { DataSource } from 'typeorm';
import { User } from '../entity/user.entity';
import { UserService } from '../user.service';

describe('UserService', () => {
  let userService: UserService;

  beforeAll(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([User])],
      providers: [UserService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });
});
