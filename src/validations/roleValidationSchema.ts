import Joi from 'joi';

export const roleValidationSchema = Joi.object({
    name: Joi.string()
        .min(5)
        .required(),

    description: Joi.string()
        .min(10)
        .required()
});