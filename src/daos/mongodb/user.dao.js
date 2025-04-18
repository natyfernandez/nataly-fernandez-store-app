import { userModel } from "./../../models/user.model.js";

export class UserDao {
    async getAllUsers() {
        return userModel.find()
    }
    async getUserById({ id }) {
        return userModel.findById(id).populate('cart.products.product')
    }
    async getUserByEmail({ email }) {
        return userModel.findOne({ email }).lean()
    }
    async createUser({ user }) {
        return userModel.create(user)
    }
    async updateUser({ id, user }) {
        return userModel.findByIdAndUpdate(id, { user }, { new: true })
    }
    async deleteUser({ id, user }) {
        return userModel.findByIdAndDelete(id)
    }
    async updateUserPassword({ id, password }) {
        return await userModel.findByIdAndUpdate(id, { password });
    }    
}