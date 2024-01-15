CREATE TABLE users(
id SERIAL PRIMARY KEY,
email VARCHAR(100) NOT NULL UNIQUE,
password VARCHAR(100)
);

SELECT email FROM users WHERE email = $1;

INSERT INTO users (email, password) 
VALUES ($1, $2)

SELECT email, password FROM users WHERE email = $1