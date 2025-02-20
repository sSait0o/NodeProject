const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

class Profile {
    static async getAllProfiles() {
        const result = await pool.query('SELECT * FROM profiles');
        return result.rows;
    }

    static async getProfileById(id) {
        const result = await pool.query(
            'SELECT * FROM profiles WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    static async createProfile({ user_id, amount, payment_date, status }) {
        const result = await pool.query(
            'INSERT INTO profiles (user_id, amount, payment_date, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, amount, payment_date, status]
        );
        return result.rows[0];
    }

    static async updateProfile(id, { user_id, amount, payment_date, status }) {
        const result = await pool.query(
            'UPDATE profiles SET user_id = $1, amount = $2, payment_date = $3, status = $4 WHERE id = $5 RETURNING *',
            [user_id, amount, payment_date, status, id]
        );
        return result.rows[0];
    }

    static async deleteProfile(id) {
        await pool.query('DELETE FROM profiles WHERE id = $1', [id]);
    }
}

module.exports = Profile;
