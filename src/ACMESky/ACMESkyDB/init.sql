CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE user_interests (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    departure_location VARCHAR(100) NOT NULL,
    arrival_location VARCHAR(100) NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    max_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    flight_code VARCHAR(100) NOT NULL,
    activation_code VARCHAR(100) NOT NULL,
    payed BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);