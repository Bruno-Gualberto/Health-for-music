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

module.exports.getFriendship = (loggedUserId, otherUserId) => {
    return db.query(
        `
        SELECT sender_id AS "senderId", recipient_id AS "recipientId", accepted
        FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1);
    `,
        [loggedUserId, otherUserId]
    );
};

module.exports.sendRequest = (loggedUserId, otherUserId) => {
    return db.query(
        `
        INSERT INTO friendships (sender_id, recipient_id, accepted)
        VALUES ($1, $2, false)
    `,
        [loggedUserId, otherUserId]
    );
};
module.exports.acceptRequest = (loggedUserId, otherUserId) => {
    return db.query(
        `
        UPDATE friendships 
        SET accepted = true
        WHERE recipient_id = $1 AND sender_id = $2
    `,
        [loggedUserId, otherUserId]
    );
};
module.exports.deleteRequest = (loggedUserId, otherUserId) => {
    return db.query(
        `
        DELETE FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1)
    `,
        [loggedUserId, otherUserId]
    );
};

module.exports.getAllFriendRequests = (userId) => {
    return db.query(
        `
        SELECT users.id, first, last, profile_pic AS "profilePic", accepted
        FROM friendships
        JOIN users
        ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)
    `,
        [userId]
    );
};

module.exports.getLatestMessages = () => {
    return db.query(`
        SELECT users.first, users.last, users.profile_pic AS "profilePic", messages.msg_sender_id AS "senderId", messages.text, messages.timestamp, messages.id AS "messageId"
        FROM messages
        JOIN users
        ON messages.msg_sender_id = users.id
        ORDER BY messages.id DESC
        LIMIT 10
    `);
};

module.exports.insertMessage = (userId, text) => {
    return db.query(
        `
        INSERT INTO messages (msg_sender_id, text)
        VALUES ($1, $2)
        RETURNING id AS "messageId", timestamp
    `,
        [userId, text]
    );
};

module.exports.getMessageSenderById = (userId) => {
    return db.query(
        `
        SELECT first, last, profile_pic AS "profilePic"
        FROM users
        WHERE id = $1
    `,
        [userId]
    );
};
