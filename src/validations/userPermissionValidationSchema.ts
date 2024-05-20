import Joi from 'joi';
import mongoose from 'mongoose';

export const userPermissionValidationSchema = Joi.object({
    roleId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error('any.invalid', { label: 'roleId' });
            }
            return value;
        }, 'ObjectId validation')
        .required(),

    moduleId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error('any.invalid', { label: 'moduleId' });
            }
            return value;
        }, 'ObjectId validation')
        .required(),
        
}).messages({
    'any.invalid': '{{#label}} must be a valid ObjectId'
});
