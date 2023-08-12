import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from './env/database.config';
import { AUTH, DATABASE, MAIL, TWILIO } from '@constant';
import { AuthEnv } from './env/auth.config';
import { MailConfig } from './env/mail.config';
import { TwilioConfig } from './env/twilio.config';

@Injectable()
export class AppConfigService {
	constructor(private configService: ConfigService) {}

	isProduction() {
		return this.configService.get('NODE_ENV') === 'production';
	}

	getBcryptSalt() {
		return parseInt(this.configService.get('SALT')) || 12;
	}

	getFileLogLevel() {
		return this.configService.get<string>('LOG_FILE_LEVEL');
	}

	getConsoleLogLevel() {
		return this.configService.get<string>('LOG_CONSOLE_LEVEL');
	}

	database() {
		return this.configService.get<DatabaseConfig>(DATABASE);
	}

	jwt() {
		return this.configService.get<AuthEnv>(AUTH).jwt;
	}

	mail() {
		return this.configService.get<MailConfig>(MAIL);
	}

	twilio() {
		return this.configService.get<TwilioConfig>(TWILIO);
	}
}
