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
            'Dude',
            'musician@dude.com',
            false
        )
        RETURNING id, doctor
    `);
};

module.exports.fakeLoginDoctor = () => {
    return db.query(`
        SELECT id, doctor
        FROM doctors
        WHERE id = 12
    `);
};

module.exports.fakeLoginUser = () => {
    return db.query(`
        SELECT id, doctor
        FROM users
        WHERE id = 2
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

module.exports.getUserById = (userId) => {
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

module.exports.getMoreArticles = (smallestId) => {
    return db.query(
        `
        SELECT title, subtitle, article_pic AS "articlePic", articles.id  AS "articleId", doctors.first, doctors.last, doctors.specialties, doctors.id AS "doctorId", (
            SELECT id FROM articles
            ORDER BY id ASC
            LIMIT 1
        ) AS "lowestId" 
        FROM articles
        JOIN doctors
        ON articles.doc_id = doctors.id
        WHERE articles.id < $1
        ORDER BY articles.id DESC
        LIMIT 3
    `,
        [smallestId]
    );
};

module.exports.getSingleArticle = (articleId) => {
    return db.query(
        `
        SELECT articles.title, articles.subtitle, articles.text, articles.article_pic AS "articlePic", articles.timestamp, doctors.first, doctors.last, doctors.doctor_pic AS "doctorPic", doctors.city, doctors.specialties, doctors.id AS "doctorId"
        FROM articles
        JOIN doctors
        ON articles.doc_id = doctors.id
        WHERE articles.id = $1
    `,
        [articleId]
    );
};

module.exports.getDoctorById = (doctorId) => {
    return db.query(
        `
        SELECT * 
        FROM doctors
        WHERE id = $1
    `,
        [doctorId]
    );
};

module.exports.getDoctorArticles = (doctorId) => {
    return db.query(
        `
        SELECT title, subtitle, article_pic AS "articlePic", id  AS "articleId", (
            SELECT id FROM articles
            WHERE doc_id = $1
            ORDER BY id ASC
            LIMIT 1
        ) AS "lowestId" 
        FROM articles
        WHERE doc_id = $1
        ORDER BY id DESC
        LIMIT 3
    `,
        [doctorId]
    );
};

module.exports.getMoreDoctorArticles = (doctorId, smallestId) => {
    return db.query(
        `
        SELECT title, subtitle, article_pic AS "articlePic", id  AS "articleId", (
            SELECT id FROM articles
            WHERE doc_id = $1
            ORDER BY id ASC
            LIMIT 1
        ) AS "lowestId" 
        FROM articles
        WHERE doc_id = $1 AND id < $2
        ORDER BY id DESC
        LIMIT 3
    `,
        [doctorId, smallestId]
    );
};

module.exports.addArticle = (doctorId, title, subtitle, text, url) => {
    return db.query(
        `
        INSERT INTO articles (doc_id, title, subtitle, text, article_pic)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id AS "articleId"
    `,
        [doctorId, title, subtitle, text, url]
    );
};
