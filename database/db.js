const spicedPg = require("spiced-pg");

const db = spicedPg(process.env.DATABASE_URL || `postgres:postgres:postgres@localhost:5432/socialnetwork`);

module.exports.addUser = (first, last, email, password) => {
    return db.query(`
        INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id
    `, [first, last, email, password]);
}

module.exports.getUserByEmail = (email) => {
    return db.query(`
        SELECT * 
        FROM users
        WHERE email = $1
    `, [email]);
}

module.exports.addResetCode = (email, secretCode) => {
    return db.query(`
        INSERT INTO reset_codes (email, code)
        VALUES ($1, $2)
        RETURNING email, code
    `, [email, secretCode]);
}

module.exports.getCode = (email) => {
    return db.query(`
        SELECT code FROM reset_codes
        WHERE CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes'
        AND email = $1
        ORDER BY timestamp DESC
        LIMIT 1
    `, [email]);
}

module.exports.updatePassword = (password, email) => {
    return db.query(`
        UPDATE users 
        SET password = $1
        WHERE email = $2
    `, [password, email]);
}