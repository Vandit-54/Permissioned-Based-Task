import Joi from 'joi';

export const userValidationSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required(),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),

    password: Joi.string()
        .min(6)
        .required(),

    phoneNumber: Joi.string()
        .pattern(/^\d+$/)
        .min(10)
        .max(15)
        .required(),

    address: Joi.string()
        .min(5)
        .required(),

    role: Joi.string()
        .valid('admin', 'user', 'manager')
        .required()
});