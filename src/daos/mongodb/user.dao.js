import { userModel } from "./../../models/user.model.js";

export class UserDao {
    async getAllUsers() {
        return await userModel.find()
    }
    async getUserById({ id }) {
        return await userModel.findById(id).populate('cart.products.product')
    }
    async getUserByEmail({ email }) {
        return await userModel.findOne({ email }).lean()
    }
    async createUser({ user }) {
        return await userModel.create(user)
    }
    async updateUser({ id, user }) {
        return await userModel.findByIdAndUpdate(id, { user }, { new: true })
    }
    async deleteUser({ id, user }) {
        return await userModel.findByIdAndDelete(id)
    }
}