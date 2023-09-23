import { AppConfigModule, AppConfigService } from '@config';
import { InterceptorModule } from '@interceptor';
import { LogMiddleware } from '@middleware';
import { UserModule } from '@modules/user';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LogModule } from '@log';
import { AuthModule } from '@modules/auth';
import { FilterModule } from '@filter';
import { AuditSubscriber } from '@shared/subscriber';
import { EmailModule } from '@shared/email';
import { TwilioModule } from '@shared/twilio';
import { PushNotificationModule } from '@shared/push-notification';
import { UploadModule } from '@shared/upload';
import { FileModule } from '@modules/file';
import { ProfileModule } from '@modules/profile';
import { CardModule } from '@modules/card';
import { TopicModule } from '@modules/topic';
import { TemporaryShareModule } from './modules/share/temporary-share.module';
@Module({
  imports: [
    UserModule,
    AppConfigModule,
    InterceptorModule,
    LogModule,
    AuthModule,
    FilterModule,
    EmailModule,
    TwilioModule,
    PushNotificationModule,
    ProfileModule,
    UploadModule,
    FileModule,
    CardModule,
    TopicModule,
    TemporaryShareModule,
  ],
  providers: [AuditSubscriber],
})
export class AppModule implements NestModule {
  constructor(private readonly configService: AppConfigService) {}

  configure(consumer: MiddlewareConsumer): void {
    !this.configService.isProduction() &&
      consumer.apply(LogMiddleware).forRoutes('*');
  }
}
