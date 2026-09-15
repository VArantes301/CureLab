const userService = require('../services/user');
const UserModel = require('../model/user');

class userController {
    static async create(req, res) {
        try {
            const newUser = await userService.createUser(req.body);
            return res.status(201).json(newUser);
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { identifier, password } = req.body;
            const user = await userService.login(identifier, password);
            return res.status(200).json(user);
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }

    static async list(req, res) {
        try {
            const users = await userService.listUser();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ erro: 'Internal server error.' });
        }
    }

    static async updateMascot(req, res) {
        try {
            const { userId } = req.params;
            const { mascot } = req.body;
            const updated = await UserModel.updateMascot(userId, mascot);
            return res.status(200).json(updated);
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }

    static async updateAddiction(req, res) {
        try {
            const { userId } = req.params;
            const { addiction_type } = req.body;
            const updated = await UserModel.updateAddiction(userId, addiction_type);
            return res.status(200).json(updated);
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }

    static async updatePhone1(req, res) {
        try {
            const { userId } = req.params;
            const { phone1 } = req.body;
            const updated = await UserModel.updatePhone1(userId, phone1);
            return res.status(200).json(updated);
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }
}

module.exports = userController;