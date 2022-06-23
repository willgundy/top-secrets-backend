const pool = require('../utils/pool');

module.exports = class User {
    id;
    firstName;
    lastName;
    email;
    #passwordHash;

    constructor(user) {
        this.id = user.id;
        this.firstName = user.first_name;
        this.lastName = user.last_name;
        this.email = user.email;
        this.#passwordHash = user.password_hash
    }

    static async insert({firstName, lastName, email, passwordHash}) {
        const { rows } = await pool.query(`insert into users 
                                                (first_name, last_name, email, password_hash)
                                                values ($1, $2, $3, $4) returning *`, 
                                                [firstName, lastName, email, passwordHash]);
        return new User(rows[0]);
    }

    static async getByEmail(email) {
        const { rows } = await pool.query(`select * from users where email=$1`, [email]);
        return new User(rows[0]);
    }

    get getPassword() {
        return this.#passwordHash;
    }
}