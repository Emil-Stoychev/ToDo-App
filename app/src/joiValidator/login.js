import Joi from "joi";

const schema = Joi.object({
    email: Joi.string().min(3).max(32).required().email({ tlds: { allow: false } }),
    password: Joi.string().min(3).max(32).required().messages({
        'string.min': 'Password must be at least {#limit} characters long',
        'any.required': 'Password is required',
    }),
});

function loginSchema(values) {
    let validatedData = schema.validate(values)

    if (validatedData?.error?.message != undefined) {
        return console.log(validatedData?.error?.message);
        // return setErrors({ message: validateData?.error?.message, type: "" });
    }

    return undefined
}

export default loginSchema