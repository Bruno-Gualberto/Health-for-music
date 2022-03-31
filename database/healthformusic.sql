DROP TABLE IF EXISTS doctors;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS articles;

CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL CHECK (first != ''),
    last VARCHAR(255) NOT NULL CHECK (last != ''),
    email VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(255),
    city VARCHAR(255),
    doctor BOOLEAN,
    doctor_pic VARCHAR,
    specialties VARCHAR(255)
);
-- add bio into doctors table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL CHECK (first !=  ''),
    last VARCHAR(255) NOT NULL CHECK (last !=  ''),
    email VARCHAR(255) NOT NULL UNIQUE,
    doctor BOOLEAN
);

CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    doc_id INT REFERENCES doctors(id),
    title VARCHAR(50),
    subtitle VARCHAR,
    text VARCHAR,
    article_pic VARCHAR,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);