import { registerAs } from '@nestjs/config';
import { AUTH } from '@constant';

export interface AuthEnv {
	jwt: JwtConfigEnv;
	google: GoogleEnv;
}

export interface GoogleEnv {
	client_id: string;
	client_secret: string;
}

export interface JwtConfigEnv {
	access: JwtSecret;
	refresh: JwtSecret;
}

export interface JwtSecret {
	expiresIn: string;
	secret: string;
}
export default registerAs(
	AUTH,
	(): AuthEnv => ({
		google: {
			client_id: process.env.GOOGLE_AUTH_CLIENT_ID,
			client_secret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
		},
		jwt: {
			access: {
				expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
				secret: process.env.JWT_ACCESS_TOKEN_SECRET,
			},
			refresh: {
				expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
				secret: process.env.JWT_REFRESH_TOKEN_SECRET,
			},
		},
	}),
);
