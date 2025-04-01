import Joi from "joi";

export const productDto = Joi.object({
    title: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).optional(),
    price: Joi.number().positive().precision(2).required(),
    stock: Joi.number().integer().min(0).required(),
    category: Joi.string().min(2).max(50).required(),
    thumbnail: Joi.string().uri().optional(),
});