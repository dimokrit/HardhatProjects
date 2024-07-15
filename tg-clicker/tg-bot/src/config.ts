import * as Joi from 'joi';

export default Joi.object({
  TELEGRAM_BOT_TOKEN: Joi.string(),
  APP_PORT: Joi.number().default(3000),
  DB_USER: Joi.string(),
  DB_PASS: Joi.string(),
  DB_HOST: Joi.string(),
  DB_PORT: Joi.number().default(5432),
  DB_DB: Joi.string(),
  DATABASE_URL: Joi.string(),
  APP_SECRET: Joi.string(),
  PASSWORD: Joi.string(),
  APP_URL: Joi.string(),
  BOT_PATH: Joi.string(),
  BOT_NAME: Joi.string(),
  APP_ENV: Joi.string().valid(...['development', 'production']),
  BACK_API_URL: Joi.string(),
  BACK_API_TOKEN: Joi.string(),
});
