const diaryService = require('../services/diary');

class diaryController {
    static async create(req, res) {
        try {
            const { userId } = req.params;
            const { content } = req.body;

            const newEntry = await diaryService.createEntry(userId, content);
            return res.status(201).json(newEntry);
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }

    static async list(req, res) {
        try {
            const { userId } = req.params;

            const entries = await diaryService.listEntries(userId);
            return res.status(200).json(entries);
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }
}

module.exports = diaryController;