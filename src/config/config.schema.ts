import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(4000),
  LOG_CONSOLE_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('debug'),
  LOG_FILE_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info'),
  DATABASE_URL: Joi.string().required(),
  ALLOW_ORIGINS: Joi.string().required(),
  TWILIO_TOKEN: Joi.string().required(),
  TWILIO_ACCOUNT_SID: Joi.string().required(),
  SEND_GRID_API_KEY: Joi.string().required(),
  EMAIL_SENDER: Joi.string().required(),
  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  OTP_EXPIRED_MINUTES: Joi.number().required(),
  THROTTLE_LIMIT: Joi.number().required(),
  THROTTLE_TTL: Joi.number().required(),
  USER_NUMBER_FAILED_PIN_LIMIT: Joi.number().required(),
  GOOGLE_BUCKET_PREFIX: Joi.string().required(),
  AZURE_STORAGE_CONNECTION_STRING: Joi.string().required(),
  AZURE_STORAGE_CONTAINER_NAME: Joi.string().required(),
  AZURE_STORAGE_SAS_EXPIRED_DAY: Joi.number().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  APPLE_CLIENT_ID: Joi.string().required(),
});
