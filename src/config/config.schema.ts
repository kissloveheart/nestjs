import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
	PORT: Joi.number().default(3000),
	LOG_CONSOLE_LEVEL: Joi.string()
		.valid('error', 'warn', 'info', 'debug')
		.default('debug'),
	LOG_FILE_LEVEL: Joi.string()
		.valid('error', 'warn', 'info', 'debug')
		.default('info'),
	DATABASE_USERNAME: Joi.string().required(),
	DATABASE_PASSWORD: Joi.string().required(),
	DATABASE_URL: Joi.string().required(),
	DATABASE_NAME: Joi.string().required(),
	DATABASE_LOGGING: Joi.boolean().default(false),
	ALLOW_ORIGINS: Joi.string().required(),
});
