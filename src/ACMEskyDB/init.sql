CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL 
);

INSERT INTO users (email, password) VALUES
('user1@example.com', 'password1'), 
('user2@example.com', 'password2'),
('user3@example.com', 'password3');

