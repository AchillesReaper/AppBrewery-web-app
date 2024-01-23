SELECT * FROM users WHERE email = $1

INSERT INTO users (email, password) VALUES ($1, $2)

