const achievementService = require('../services/achievement');

class achievementController {
    static async list(req, res) {
        try {
            const { userId } = req.params;
            const achievements = await achievementService.listAchievements(userId);
            return res.status(200).json(achievements);
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }
}

module.exports = achievementController;