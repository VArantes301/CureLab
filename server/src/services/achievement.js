const UserModel = require('../model/user');
const { getAchievements } = require('../utils/achievements');

class achievementService {
    static async listAchievements(userId) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        return getAchievements(user.longest_streak);
    }
}

module.exports = achievementService;