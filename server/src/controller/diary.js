const diaryService = require('../services/diary');

class diaryController {
    static async create(req, res) {
        try {
            const { userId } = req.params;
            const { title, content, mood } = req.body;

            const imageUrls = (req.files || []).map(
                (file) => `${req.protocol}://${req.get('host')}/diaryImages/${file.filename}`
            );

            const newEntry = await diaryService.createEntry(userId, title, content, mood, imageUrls);
            
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

    static async getOne(req, res) {
        try {
            const { userId, diaryId } = req.params;
            const entry = await diaryService.getEntry(userId, diaryId);
            return res.status(200).json(entry);
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }
}

module.exports = diaryController;