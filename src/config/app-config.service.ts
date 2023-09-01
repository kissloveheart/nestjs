import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  isProduction() {
    return this.configService.get('NODE_ENV') === 'production';
  }

  bcryptSalt() {
    return parseInt(this.configService.get('SALT')) || 12;
  }

  fileLogLevel() {
    return this.configService.get<string>('LOG_FILE_LEVEL');
  }

  consoleLogLevel() {
    return this.configService.get<string>('LOG_CONSOLE_LEVEL');
  }

  database() {
    return {
      url: this.configService.get<string>('DATABASE_URL'),
    };
  }

  jwt() {
    return {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    };
  }

  mail() {
    return {
      apiKey: this.configService.get<string>('SEND_GRID_API_KEY'),
      sender: this.configService.get<string>('EMAIL_SENDER'),
    };
  }

  twilio() {
    return {
      accountSid: this.configService.get<string>('TWILIO_ACCOUNT_SID'),
      serviceSid: this.configService.get<string>('TWILIO_SERVICE_SID'),
      token: this.configService.get<string>('TWILIO_TOKEN'),
    };
  }
}
