const pool = require('../utils/pool');

module.exports = class Secret {
    id;
    title;
    description;
    createdAt;

    constructor(secret) {
        this.id = secret.id;
        this.title = secret.title;
        this.description = secret.description;
        this.createdAt = secret.created_at;
    }

    static async getAll() {
        const { rows } = await pool.query(`select * from secrets`);
        return  rows.map((row) => new Secret(row));
    }
}