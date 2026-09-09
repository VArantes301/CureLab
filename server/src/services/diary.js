const DiaryModel = require('../model/diary');
const UserModel = require('../model/user');
const getMotivationalMessage = require('../utils/mascotMessage');


class diaryService {
    static async createEntry(userId, content) {
        if (!content || content.trim() === '') {
            throw new Error('Diary content is required');
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const diaryEntry = await DiaryModel.create(userId, content);
        const updatedUser = await diaryService.updateStreak(user);
        const motivationalMessage = getMotivationalMessage(user.mascot);

        return {
            ...diaryEntry,
            current_streak: updatedUser.current_streak,
            motivational_message: motivationalMessage
        };
    }

    static async updateStreak(user) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split('T')[0];

        let newStreak;

        if (!user.last_diary_date) {
            newStreak = 1;
        } else {
            const lastDate = new Date(user.last_diary_date);
            lastDate.setHours(0, 0, 0, 0);

            const diffInDays = Math.round(
                (today - lastDate) / (1000 * 60 * 60 * 24)
            );

            if (diffInDays === 0) {
                newStreak = user.current_streak;
            } else if (diffInDays === 1) {
                newStreak = user.current_streak + 1;
            } else {
                newStreak = 1;
            }
        }

        return await UserModel.updateStreak(user.id, newStreak, todayStr);
    }

    static async listEntries(userId) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        return await DiaryModel.findByUser(userId);
    }
}

module.exports = diaryService;