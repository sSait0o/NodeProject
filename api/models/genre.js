const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

class Genre {
    static async getAllGenres() {
        const result = await pool.query('SELECT * FROM genres');
        return result.rows;
    }

    static async getGenreById(id) {
        const result = await pool.query(
            'SELECT * FROM genres WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    static async createGenre({ user_id, genre_name }) {
        const result = await pool.query(
            'INSERT INTO genres (user_id, genre_name) VALUES ($1, $2) RETURNING *',
            [user_id, genre_name]
        );
        return result.rows[0];
    }

    static async updateGenre(id, { user_id, genre_name }) {
        const result = await pool.query(
            'UPDATE genres SET user_id = $1, genre_name = $2 WHERE id = $3 RETURNING *',
            [user_id, genre_name, id]
        );
        return result.rows[0];
    }

    static async deleteGenre(id) {
        await pool.query('DELETE FROM genres WHERE id = $1', [id]);
    }
}

module.exports = Genre;
