const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

class Payment {
    static async getAllPayments() {
        const result = await pool.query('SELECT * FROM payments');
        return result.rows;
    }

    static async getPaymentById(id) {
        const result = await pool.query(
            'SELECT * FROM payments WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    static async createPayment({ user_id, amount, payment_date, status }) {
        const result = await pool.query(
            'INSERT INTO payments (user_id, amount, payment_date, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, amount, payment_date, status]
        );
        return result.rows[0];
    }

    static async updatePayment(id, { user_id, amount, payment_date, status }) {
        const result = await pool.query(
            'UPDATE payments SET user_id = $1, amount = $2, payment_date = $3, status = $4 WHERE id = $5 RETURNING *',
            [user_id, amount, payment_date, status, id]
        );
        return result.rows[0];
    }

    static async deletePayment(id) {
        await pool.query('DELETE FROM payments WHERE id = $1', [id]);
    }
}

module.exports = Payment;
