import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new Schema({
    title: { type: String, require: true },
    description: { type: String, require: false },
    price: { type: Number, require: true },
    stock: { type: Number, require: true },
    category: { type: String, require: true },
    thumbnail: { type: String, require: false },
})

productSchema.index({ title: 1, price: 1, category: 1 })
productSchema.plugin(mongoosePaginate)

export const productsModel = model("products", productSchema)