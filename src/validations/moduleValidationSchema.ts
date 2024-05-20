import Joi from 'joi';

export const moduleValidationSchema = Joi.object({
    name: Joi.string()
        .min(5) 
        .required(), 

    description: Joi.string()
        .min(10) 
        .required()
});
