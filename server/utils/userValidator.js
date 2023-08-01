const Joi = require("joi");

// REGISTER SCHEMA

const registerSchemaTest = Joi.object({
    email: Joi.string().min(3).max(32).required().email({ tlds: { allow: false } }),
    password: Joi.string().min(3).max(32).required().messages({
        'string.min': 'Password must be at least {#limit} characters long',
        'any.required': 'Password is required',
    }),
    rePassword: Joi.string().min(3).max(32).required().valid(Joi.ref('password')).messages({
        'string.min': 'RePassword must be at least {#limit} characters long',
        'any.required': 'RePassword is required',
    }),
    image: Joi.string().min(3).required(),
});

function registerSchema(values) {
    let validatedData = registerSchemaTest.validate(values)

    if (validatedData?.error?.message != undefined) {
        return validatedData?.error?.message
        // return setErrors({ message: validateData?.error?.message, type: "" });
    }

    return undefined
}

// PROFILE EDIT SCHEMA

const profileSchemaTest = Joi.object({
    email: Joi.string().min(3).max(32).required().email({ tlds: { allow: false } }),
    password: Joi.string().min(3).max(32).required().messages({
        'string.min': 'Password must be at least {#limit} characters long',
        'any.required': 'Password is required',
    }),
    newPass: Joi.string().min(3).max(32).required().valid(Joi.ref('password')).messages({
        'string.min': 'NewPass must be at least {#limit} characters long',
        'any.required': 'NewPass is required',
    }),
    image: Joi.string().min(3).required(),
});

function profileEditSchema(values) {
    let validatedData = profileSchemaTest.validate(values)

    if (validatedData?.error?.message != undefined) {
        return validatedData?.error?.message
        // return setErrors({ message: validateData?.error?.message, type: "" });
    }

    return undefined
}

module.exports = {
    registerSchema,
    profileEditSchema
}