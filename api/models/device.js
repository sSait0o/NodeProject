const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

class Device {
    static async getAllDevices() {
        const result = await pool.query('SELECT * FROM devices');
        return result.rows;
    }

    static async getDeviceById(id) {
        const result = await pool.query(
            'SELECT * FROM devices WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    static async createDevice({ user_id, device_name, device_type, last_active }) {
        const result = await pool.query(
            'INSERT INTO devices (user_id, device_name, device_type, last_active) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, device_name, device_type, last_active]
        );
        return result.rows[0];
    }

    static async updateDevice(id, { user_id, device_name, device_type, last_active }) {
        const result = await pool.query(
            'UPDATE devices SET user_id = $1, device_name = $2, device_type = $3, last_active = $4 WHERE id = $5 RETURNING *',
            [user_id, device_name, device_type, last_active, id]
        );
        return result.rows[0];
    }

    static async deleteDevice(id) {
        await pool.query('DELETE FROM devices WHERE id = $1', [id]);
    }
}

module.exports = Device;
