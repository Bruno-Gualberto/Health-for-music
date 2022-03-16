const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/socialnetwork`
);

module.exports.addUser = (first, last, email, password) => {
    return db.query(
        `
        INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id
    `,
        [first, last, email, password]
    );
};

module.exports.getUserByEmail = (email) => {
    return db.query(
        `
        SELECT * 
        FROM users
        WHERE email = $1
    `,
        [email]
    );
};

module.exports.addResetCode = (email, secretCode) => {
    return db.query(
        `
        INSERT INTO reset_codes (email, code)
        VALUES ($1, $2)
        RETURNING email, code
    `,
        [email, secretCode]
    );
};

module.exports.getCode = (email) => {
    return db.query(
        `
        SELECT code FROM reset_codes
        WHERE CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes'
        AND email = $1
        ORDER BY timestamp DESC
        LIMIT 1
    `,
        [email]
    );
};

module.exports.updatePassword = (password, email) => {
    return db.query(
        `
        UPDATE users 
        SET password = $1
        WHERE email = $2
    `,
        [password, email]
    );
};

module.exports.getUserById = (userId) => {
    return db.query(
        `
        SELECT first, last, email, bio,
        profile_pic AS "profilePic", id 
        FROM users
        WHERE id = $1
    `,
        [userId]
    );
};

module.exports.updateImage = (userId, url) => {
    return db.query(
        `
        UPDATE users
        SET profile_pic = $2
        WHERE id = $1
        RETURNING profile_pic AS "profilePic"
    `,
        [userId, url]
    );
};

module.exports.addUpdateBio = (bio, userId) => {
    return db.query(
        `
        UPDATE users
        SET bio = $1
        WHERE id = $2
        RETURNING bio
   `,
        [bio, userId]
    );
};

module.exports.getLastUsers = () => {
    return db.query(`
        SELECT id, first, last, profile_pic AS "profilePic", bio
        FROM users
        ORDER BY id DESC
        LIMIT 6
    `);
};

module.exports.getSearchedUsers = (searchTerm) => {
    return db.query(
        `
        SELECT id, first, last, profile_pic AS "profilePic", bio
        FROM users
        WHERE first ILIKE $1
        ORDER BY first DESC
        LIMIT 6
    `,
        [searchTerm + "%"]
    );
};

module.exports.getOtherUser = (userId) => {
    return db.query(
        `
        SELECT id, first, last, profile_pic AS "profilePic", bio
        FROM users
        WHERE id = $1
    `,
        [userId]
    );
};
