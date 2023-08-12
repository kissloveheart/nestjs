import { MAIL, TWILIO } from '@constant';
import { registerAs } from '@nestjs/config';
import * as process from 'process';

export interface TwilioConfig {
	accountSid: string;
	serviceSid: string;
	token: string;
}

export default registerAs(
	TWILIO,
	(): TwilioConfig => ({
		accountSid: process.env.TWILIO_ACCOUNT_SID,
		serviceSid: process.env.TWILIO_SERVICE_SID,
		token: process.env.TWILIO_TOKEN,
	}),
);
