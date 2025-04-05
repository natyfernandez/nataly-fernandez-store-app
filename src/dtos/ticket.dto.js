import Joi from "joi";

export const ticketDto = Joi.object({
    code: Joi.string().hex().length(24),
    amount: Joi.number().min(0).required(),
    purchaser: Joi.string().email().required(),
    products: Joi.array()
        .items(
            Joi.object({
                product: Joi.string().hex().length(24).required(),
                quantity: Joi.number().integer().min(1).required(),
            })
        ).min(1).required(),
    status: Joi.string().valid("pending", "cancelled", "completed").default("pending"),
});
