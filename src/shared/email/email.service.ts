import { Injectable } from '@nestjs/common';
import { AppConfigService } from '@config';
import { MailService } from '@sendgrid/mail';
import { LogService } from '@log';

@Injectable()
export class EmailService {
  private sendGridClient: MailService;
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly log: LogService,
  ) {
    this.sendGridClient = new MailService();
    this.sendGridClient.setApiKey(this.appConfigService.mail().apiKey);
  }

  async send(to: string, subject: string, body: string) {
    const msg = {
      to: to,
      from: this.appConfigService.mail().sender,
      subject: subject,
      html: body,
    };

    this.sendGridClient.send(msg);
  }
}
