const UserModel = require('../model/user')

class userService {
    static async createUser(data) {

        if(!data.name || !data.email || !data.password) {
            throw new Error('Name, email and password they are required');
        }

        const existingUser = await UserModel.findByEmail(data.email);
        if (existingUser) {
            throw new Error('A user with this email already exist');
        }

        return await UserModel.create(data);
    }

    static async listUser() {
        return await UserModel.findAll()
    }

    static async login(identifier, password) {
        if(!identifier || !password) {
            throw new Error('Identifier and password are required');
        }

        const user = await UserModel.findByNameOrEmail(identifier)

        if (!user || user.password !== password) {
            throw new Error('Invalid credentials');
        }

        const { password: _, ...UserWithoutPassword} = user;
        return UserWithoutPassword
    }
}

module.exports = userService;