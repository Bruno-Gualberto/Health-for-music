const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/healthformusic`
);

module.exports.addDoctor = () => {
    return db.query(`
        INSERT INTO doctors (first, last, email, address, city_country, phone, bio, doctor, specialties)
        VALUES (
            'Spider', 
            'Doctor', 
            'spider@doctor.com',
            'Ritterstraße 12-14, 10969',
            'Berlin, Germany',
            '+49 1234567890',
            'I studied in Brooklin, friend of the neighbourhood and nothing to be suspicious about.',
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
        WHERE id = 1
    `);
};

module.exports.fakeLoginUser = () => {
    return db.query(`
        SELECT id, doctor
        FROM users
        WHERE id = 1
    `);
};

module.exports.getDoctorById = (userId) => {
    return db.query(
        `
        SELECT id, first, last, email, address, city_country AS cityAndCountry, doctor, doctor_pic AS "doctorPic", specialties, phone, bio
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
        SELECT articles.title, articles.subtitle, articles.text, articles.article_pic AS "articlePic", articles.timestamp, doctors.first, doctors.last, doctors.doctor_pic AS "doctorPic", doctors.city_country AS "cityAndCountry", doctors.specialties, doctors.id AS "doctorId"
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
        SELECT id, first, last, email, address, city_country AS "cityAndCountry", phone, bio, doctor, doctor_pic AS "doctorPic", specialties
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

module.exports.getArticleForEdit = (articleId) => {
    return db.query(
        `
        SELECT title, subtitle, text
        FROM articles
        WHERE id = $1
    `,
        [articleId]
    );
};

module.exports.updateArticleWithPic = (
    articleId,
    title,
    subtitle,
    text,
    articlePic
) => {
    return db.query(
        `
        UPDATE articles
        SET title = $2, subtitle = $3, text = $4, article_pic = $5
        WHERE id = $1
        RETURNING id AS "articleId"
    `,
        [articleId, title, subtitle, text, articlePic]
    );
};

module.exports.updateArticleText = (articleId, title, subtitle, text) => {
    return db.query(
        `
        UPDATE articles
        SET title = $2, subtitle = $3, text = $4
        WHERE id = $1
        RETURNING id AS "articleId"
    `,
        [articleId, title, subtitle, text]
    );
};

module.exports.updateProfileWithPic = (
    doctorId,
    first,
    last,
    specialties,
    email,
    phone,
    address,
    cityAndCountry,
    bio,
    doctorPic
) => {
    return db.query(
        `
        UPDATE doctors
        SET first = $2, last = $3, specialties = $4, email = $5, phone = $6, address = $7, city_country = $8, bio = $9, doctor_pic = $10
        WHERE id = $1
        RETURNING first, last, specialties, email, phone, address, city_country AS "cityAndCountry", bio, doctor_pic AS "doctorPic"
    `,
        [
            doctorId,
            first,
            last,
            specialties,
            email,
            phone,
            address,
            cityAndCountry,
            bio,
            doctorPic,
        ]
    );
};

module.exports.updateProfileText = (
    doctorId,
    first,
    last,
    specialties,
    email,
    phone,
    address,
    cityAndCountry,
    bio
) => {
    return db.query(
        `
        UPDATE doctors
        SET first = $2, last = $3, specialties = $4, email = $5, phone = $6, address = $7, city_country = $8, bio = $9
        WHERE id = $1
        RETURNING first, last, specialties, email, phone, address, city_country AS "cityAndCountry", bio, doctor_pic AS "doctorPic"
    `,
        [
            doctorId,
            first,
            last,
            specialties,
            email,
            phone,
            address,
            cityAndCountry,
            bio,
        ]
    );
};
