import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '@shared/email';
import { TwilioModule } from '@shared/twilio';
import { TemporaryShare } from './entity/temporary-share.entity';
import { ShareController as TemporaryShareController } from './temporary-share.controller';
import { TemporaryShareService as TemporaryShareService } from './temporary-share.service';
import { ProfileModule } from '@modules/profile';
import { TopicModule } from '@modules/topic';

@Module({
  imports: [
    TypeOrmModule.forFeature([TemporaryShare]),
    forwardRef(() => ProfileModule),
    TopicModule,
    EmailModule,
    TwilioModule,
  ],
  controllers: [TemporaryShareController],
  providers: [TemporaryShareService],
})
export class TemporaryShareModule {}
