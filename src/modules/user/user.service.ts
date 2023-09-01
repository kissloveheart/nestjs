import { UserStatus } from '@enum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { MongoRepository } from 'typeorm';
import { UserCreateDto } from './dto/user-create.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: MongoRepository<UserEntity>,
  ) {
    super(userRepository);
  }

  async create(dto: UserCreateDto) {
    const user = new UserEntity(dto);
    return await this.save(user);
  }

  async findByEmail(email: string) {
    const data = await this.findOne({
      where: {
        email,
        status: UserStatus.ACTIVE,
      },
    });

    return data;
  }

  async checkExistEmail(email: string) {
    return !!(await this.findByEmail(email));
  }
}
