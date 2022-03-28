DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS articles;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL CHECK (first != ''),
    last VARCHAR(255) NOT NULL CHECK (last != ''),
    email VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(255),
    city VARCHAR(255),
    doctor BOOLEAN,
    specialties VARCHAR(255)
);

CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    doc_id INT REFERENCES users(id),
    content VARCHAR,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);