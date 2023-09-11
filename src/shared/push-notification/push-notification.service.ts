import { LogService } from '@log';
import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';

@Injectable()
export class PushNotificationService {
  private client: admin.app.App;
  constructor(private readonly log: LogService) {
    this.client = admin.initializeApp();
    this.log.setContext(PushNotificationService.name);
  }

  async send(fcm: string | string[], title: string, body: string) {
    if (!Array.isArray(fcm)) fcm = [fcm];

    const message = {
      notification: {
        title,
        body,
      },
      tokens: fcm,
    };

    this.client
      .messaging()
      .sendEachForMulticast(message)
      .then((res) =>
        this.log.debug('Send push notification success', {
          success: res.successCount,
          failed: res.failureCount,
        }),
      )
      .catch((err) => this.log.error(err, 'Send push notification failed'));
  }

  // TODO this to test, delete if any
  // onApplicationBootstrap() {
  //   this.send(
  //     'fiDjGwuzSzuhJmXFcPRRvg:APA91bEcAUwb2I7FkLtfD7PlLi6le6g7N1eHMrnHEocF1xqXaRDG2F93mnwVFqWxqvQueFTMjroNu7ozzht5mKLNGpsMH0uWDn3mxMubTOp_SLByDf47Pxj2k24OanRo8FEFEvc98WPk',
  //     'Hello',
  //     'knk',
  //   );
  // }
}
