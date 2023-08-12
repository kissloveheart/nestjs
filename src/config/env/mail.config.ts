import { MAIL } from '@constant';
import { registerAs } from '@nestjs/config';
import * as process from 'process';

export interface MailConfig {
	apiKey: string;
	sender: string;
}

export default registerAs(
	MAIL,
	(): MailConfig => ({
		apiKey: process.env.SEND_GRID_API_KEY,
		sender: process.env.EMAIL_SENDER,
	}),
);
