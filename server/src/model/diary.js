const pool = require('../config/db')

class DiaryModel {
    static async create(userId, content) {
        const result = await pool.query(
            `INSERT INTO diaries (user_id, content)
             VALUES ($1, $2)
             RETURNING id, user_id, content, created_at`,
             [userId, content]
        );

        return result.rows[0]
    }

    static async findByUser(userId) {
        const result = await pool.query(
            `SELECT id, content, created_at
             FROM diaries
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [userId]
        );
        return result.rows;
        
    }
}

module.exports = DiaryModel

