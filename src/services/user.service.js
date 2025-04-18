import { userDao } from "../daos/index.dao.js";

export class UserService {
    async getAllUsers() {
        return await userDao.getAllUsers()
    }
    async getUserById({ id }) {
        return await userDao.getUserById({ id })
    }
    async getUserByEmail({ email }) {
        return await userDao.getUserByEmail({ email })
    }
    async createUser({ user }) {
        return await userDao.createUser({ user })
    }
    async updateUser({ id, user }) {
        return await userDao.updateUser({ id, user })
    }
    async deleteUser({ id, user }) {
        return await userDao.deleteUser({ id, user })
    }
    async updateUserPassword({ id, password }) {
        return await userDao.updateUserPassword({ id, password });
    }
}

export const userService = new UserService;



































