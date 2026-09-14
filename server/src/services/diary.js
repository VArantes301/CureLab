const DiaryModel = require('../model/diary');
const UserModel = require('../model/user');
const getMotivationalMessage = require('../utils/mascotMessage');
const { getNewlyUnlocked } = require('../utils/achievements')


class diaryService {
    static async createEntry(userId, title, content, imageUrls = []) {
        if (!title || title.trim() === '') {
            throw new Error('Diary title is required')
        }
        if (!content || content.trim() === '') {
            throw new Error('Diary content is required');
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const diaryEntry = await DiaryModel.create(userId, title, content);

        for (const imageUrl of imageUrls) {
            await DiaryModel.addImage(diaryEntry.id, imageUrl);
        }

        const oldLongestStreak = user.longest_streak;
        const updatedUser = await diaryService.updateStreak(user);
        const newAchievements = getNewlyUnlocked(oldLongestStreak, updatedUser.longest_streak);
        const motivationalMessage = getMotivationalMessage(user.mascot);

        return {
            ...diaryEntry,
            images: imageUrls,
            current_streak: updatedUser.current_streak,
            longest_streak: updatedUser.longest_streak,
            motivational_message: motivationalMessage,
            new_achievements: newAchievements,
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

        const newLongestStreak = Math.max(user.longest_streak, newStreak);

        return await UserModel.updateStreak(user.id, newStreak, todayStr, newLongestStreak);
    }

    static async getEntry(userId, diaryId) {
        const diary = await DiaryModel.findById(diaryId, userId);
        if (!diary) {
            throw new Error('Diary not found');
        }
        return diary;
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