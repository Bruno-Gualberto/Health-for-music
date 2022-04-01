DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS private_messages;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL CHECK (first != ''),
    last VARCHAR(255) NOT NULL CHECK (last != ''),
    email VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(255),
    city_country VARCHAR(255),
    phone VARCHAR(25),
    bio VARCHAR(255),
    doctor BOOLEAN,
    profile_pic VARCHAR,
    specialties VARCHAR(255)
);

CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    doc_id INT REFERENCES users(id),
    title VARCHAR(50),
    subtitle VARCHAR(255),
    text VARCHAR,
    article_pic VARCHAR,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE private_messages (
    id SERIAL PRIMARY KEY,
    logged_user_id INT REFERENCES users(id),
    other_user_id INT REFERENCES users(id),
    text VARCHAR NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)