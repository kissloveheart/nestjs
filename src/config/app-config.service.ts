import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { COMMA } from '@constant';

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

  isUseLogFile() {
    return this.configService.get<string>('LOG_FILE_USE') === 'true';
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
      phoneNumber: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
    };
  }

  OTPExpiredMinutes() {
    return this.configService.get<number>('OTP_EXPIRED_MINUTES');
  }

  throttler() {
    return {
      ttl: this.configService.get<number>('THROTTLE_TTL'),
      limit: this.configService.get<number>('THROTTLE_LIMIT'),
    };
  }

  user() {
    return {
      numberFailedPinLimit: this.configService.get<number>(
        'USER_NUMBER_FAILED_PIN_LIMIT',
      ),
    };
  }

  google() {
    return {
      bucketName: this.configService.get<string>('GOOGLE_BUCKET_NAME'),
      bucketPrefix: this.configService.get<string>('GOOGLE_BUCKET_PREFIX'),
      clientId: this.configService.get<string>('GOOGLE_CLIENT_ID').split(COMMA),
    };
  }

  cors() {
    return {
      origin: this.configService.get<string>('ALLOW_ORIGINS').split(COMMA),
    };
  }

  port() {
    return this.configService.get<number>('PORT');
  }

  azure() {
    return {
      storage: {
        connectionString: this.configService.get<string>(
          'AZURE_STORAGE_CONNECTION_STRING',
        ),
        containerName: this.configService.get<string>(
          'AZURE_STORAGE_CONTAINER_NAME',
        ),
        sasExpiredDay: this.configService.get<number>(
          'AZURE_STORAGE_SAS_EXPIRED_DAY',
        ),
      },
    };
  }

  apple() {
    return {
      clientId: this.configService.get<string>('APPLE_CLIENT_ID').split(COMMA),
    };
  }
}
