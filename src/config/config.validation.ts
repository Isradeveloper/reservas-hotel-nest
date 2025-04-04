import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  ENV: Joi.string().valid('dev', 'prod', 'test').required(),
  PORT: Joi.number().required(),
  DATABASE_URL: Joi.string().uri().required(),
});
