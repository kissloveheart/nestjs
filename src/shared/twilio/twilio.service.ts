import { AppConfigService } from '@config';
import { LogService } from '@log';
import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { APPROVED } from '@constant';

@Injectable()
export class TwilioService {
  private twilioClient: Twilio;
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly log: LogService,
  ) {
    this.twilioClient = new Twilio(
      this.appConfigService.twilio().accountSid,
      this.appConfigService.twilio().token,
    );
  }

  sendVerification(email: string) {
    this.twilioClient.verify.v2
      .services(this.appConfigService.twilio().serviceSid)
      .verifications.create({ to: email, channel: 'email' })
      .then((value) => this.log.info(`Sent email to ${email}`, value.sid))
      .catch((err) => this.log.error(err));
  }

  async checkVerification(email: string, code: string) {
    try {
      const { status } = await this.twilioClient.verify.v2
        .services(this.appConfigService.twilio().serviceSid)
        .verificationChecks.create({
          to: email,
          code: code,
        });
      return status === APPROVED;
    } catch (err) {
      this.log.error(err);
      return false;
    }
  }
}
