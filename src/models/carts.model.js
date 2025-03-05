import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: { 
    type: [
        {
            product: { type: Schema.Types.ObjectId, ref: "products" },
            quantity: { type: Number, min: 1 }
        }
    ], 
    default: [],
    },
})

cartSchema.index({ title: 1, price: 1, category: 1 })

export const cartsModel = model("carts", cartSchema)