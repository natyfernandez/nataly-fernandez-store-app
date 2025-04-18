import { v4 as uuid } from "uuid";

const users = [];

export class UserDao {
    async getAllUsers() {
        return users;
    }
    
    async getUserById({ id }) {
        return users.find(user => user.id === id);
    }
    
    async getUserByEmail({ email }) {
        return users.find(user => user.email === email);
    }
    
    async createUser({ user }) {
        const newUser = {
            id: uuid(),
            ...user
        };
        users.push(newUser);
        return newUser;
    }
    
    async updateUser({ id, user }) {
        const index = users.findIndex(u => u.id === id);
        if (index === -1) return null;
        
        users[index] = { ...users[index], ...user };
        return users[index];
    }
    
    async deleteUser({ id }) {
        const index = users.findIndex(u => u.id === id);
        if (index === -1) return null;
        
        return users.splice(index, 1)[0];
    }

    async updateUserPassword({ id, password }) {
        const index = users.findIndex(user => user.id === id);
        if (index === -1) return null;
    
        users[index].password = password;
        return users[index];
    }    
}