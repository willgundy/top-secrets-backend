const pool = require('../utils/pool');

module.exports = class User {
    id;
    firstName;
    lastName;
    email;
    #passwordHash;

    constructor(user) {
        this.id = user.id;
        this.firstname = user.first_name;
        this.lastname = user.last_name;
        this.email = user.email;
        this.#passwordhash = user.password_hash
    }
}