import Joi from "joi";

export const userDto = Joi.object({
    first_name: Joi.string().min(2).max(50).required(),
    last_name: Joi.string().min(2).max(50).required(),
    age: Joi.number().integer().min(0).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    cart: Joi.string().optional(),
    role: Joi.string().valid("user", "admin").default("user"),
});