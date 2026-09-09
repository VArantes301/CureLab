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
}

module.exports = userService;