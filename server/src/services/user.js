const bcrypt = require('bcrypt');
const UserModel = require('../model/user');

const SALT_ROUNDS = 10;

class userService {
    static async createUser(data) {
        if (!data.name || !data.email || !data.password) {
            throw new Error('Name, email and password are required');
        }

        const normalizedEmail = data.email.toLowerCase().trim();

        const existingUser = await UserModel.findByEmail(normalizedEmail);
        if (existingUser) {
            throw new Error('A user with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

        return await UserModel.create({ 
            ...data, 
            email: normalizedEmail, 
            password: hashedPassword 
        });
    }

    static async listUser() {
        return await UserModel.findAll();
    }

    static async login(identifier, password) {
        if (!identifier || !password) {
            throw new Error('Identifier and password are required');
        }

        const normalizedIdentifier = identifier.toLowerCase().trim();
        const user = await UserModel.findByNameOrEmail(normalizedIdentifier);

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            throw new Error('Invalid credentials');
        }

        const { password: _, ...UserWithoutPassword } = user;
        return UserWithoutPassword;
    }
}

module.exports = userService;