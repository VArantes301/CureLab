const pool = require('../config/db');

class UserModel {
    static async create(data) {
        const { name, email, password, phone1, phone2, addiction_type, current_streak, longest_streak, last_diary_date, mascot } = data;

        const query = `
            INSERT INTO users (name, email, password, phone1, phone2)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, email, phone1, phone2, addiction_type, current_streak, longest_streak, last_diary_date, mascot
        `;

        const values = [name, email, password, phone1, phone2];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findAll() {
        const result = await pool.query(
            'SELECT id, name, email, phone1, phone2, addiction_type, current_streak, longest_streak, last_diary_date, mascot FROM users'
        );
        return result.rows;
    }

    static async findByEmail(email) {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    }

    static async findById(id) {
    const result = await pool.query(
        'SELECT id, name, email, addiction_type, current_streak,longest_streak, last_diary_date, mascot FROM users WHERE id = $1',
        [id]
    );
    return result.rows[0];
}

    static async findByNameOrEmail(identifier) {
    const result = await pool.query(
        'SELECT * FROM users WHERE LOWER(email) = $1 OR LOWER(name) = $1',
        [identifier]
    );
    return result.rows[0];
}

    
    static async updateAddiction(userId, addictionType) {
    const result = await pool.query(
        `UPDATE users
         SET addiction_type = $1
         WHERE id = $2
         RETURNING id, name, email, addiction_type`,
        [addictionType, userId]
    );
    return result.rows[0];
}

    static async updateStreak(userId, currentStreak, lastDiaryDate, longestStreak) {
    const result = await pool.query(
        `UPDATE users
         SET current_streak = $1, last_diary_date = $2, longest_streak = $3
         WHERE id = $4
         RETURNING id, name, email, current_streak, longest_streak, last_diary_date`,
        [currentStreak, lastDiaryDate, longestStreak, userId]
    );
    return result.rows[0];
}

    static async updateMascot(userId, mascot) {
        const result = await pool.query(
            `UPDATE users SET mascot = $1 WHERE id = $2
            RETURNING id, name, mascot`,
            [mascot, userId]
        );
        return result.rows[0];
    }

    static async updatePhone1(userId, phone1) {
    const result = await pool.query(
        `UPDATE users SET phone1 = $1 WHERE id = $2
         RETURNING id, name, phone1`,
        [phone1, userId]
    );
    return result.rows[0];
    }
}

module.exports = UserModel;