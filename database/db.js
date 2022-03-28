const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/healthformusic`
);

module.exports.addDoctor = () => {
    return db.query(`
        INSERT INTO users (first, last, email, address, city, doctor, specialties)
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
