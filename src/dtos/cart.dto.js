import Joi from "joi";

export const cartDto = Joi.object({
    products: Joi.array()
        .items(
            Joi.object({
                product: Joi.string().required(),
                quantity: Joi.number().integer().min(1).required(),
            })
        )
        .default([]),
});
