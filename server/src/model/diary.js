const pool = require('../config/db')

class DiaryModel {

    static async create(userId, title, content) {
    const result = await pool.query(
        `INSERT INTO diaries (user_id, title, content)
         VALUES ($1, $2, $3)
         RETURNING id, user_id, title, content, created_at`,
        [userId, title, content]
        );

        return result.rows[0];
    }

    static async addImage(diaryId, imageUrl) {
        const result = await pool.query(
            `INSERT INTO diary_images (diary_id, image_url)
             VALUES ($1, $2)
             RETURNING id, diary_id, image_url`,
             [diaryId, imageUrl]           
        );
        return result.rows[0]
    }

    static async findByUser(userId) {
        const result = await pool.query(
            `SELECT id, title, created_at
             FROM diaries
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [userId]
        );
        return result.rows;      
    }

    static async findById(diaryId, userId) {
        const diaryresult = await pool.query(
            'SELECT id, title, content, created_at FROM diaries WHERE id = $1 AND user_id = $2',
            [diaryId, userId]
        );
        const diary = diaryresult.rows[0];

        if(!diary) return null;

        const imagesResult = await pool.query(
            'SELECT id, image_url FROM diary_images WHERE diary_id = $1',
            [diaryId]
        );

        return { ...diary, images: imagesResult.rows };
    }
}

module.exports = DiaryModel

