const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/healthformusic`
);

module.exports.addDoctor = () => {
    return db.query(`
        INSERT INTO doctors (first, last, email, address, city, doctor, specialties)
        VALUES (
            'Bruno', 
            'Gualberto', 
            'bruno@gualberto.com',
            'Ritterstraße 12-14',
            'Berlin',
            true,
            'hand'
        )
        RETURNING id, doctor
    `);
};

module.exports.addUser = () => {
    return db.query(`
        INSERT INTO users (first, last, email, doctor)
        VALUES (
            'Musician',
            'Guy',
            'musician@guy.com',
            false
        )
        RETURNING id, doctor
    `);
};

module.exports.getDoctorById = (userId) => {
    return db.query(
        `
        SELECT * 
        FROM doctors
        WHERE id = $1
    `,
        [userId]
    );
};

module.exports.getUserbyId = (userId) => {
    return db.query(
        `
        SELECT * 
        FROM users
        WHERE id = $1
    `,
        [userId]
    );
};

module.exports.getArticles = () => {
    return db.query(`
        SELECT title, subtitle, article_pic AS "articlePic", articles.id  AS "articleId", doctors.first, doctors.last, doctors.specialties, doctors.id AS "doctorId", (
            SELECT id FROM articles
            ORDER BY id ASC
            LIMIT 1
        ) AS "lowestId" 
        FROM articles
        JOIN doctors
        ON articles.doc_id = doctors.id
        ORDER BY articles.id DESC
        LIMIT 3
    `);
};
