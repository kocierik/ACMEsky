CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE user_interests (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    departure_location CHAR(3) NOT NULL,
    arrival_location CHAR(3) NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    max_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE flights (
    flight_code VARCHAR(10) NOT NULL,
    activation_code VARCHAR(100) NOT NULL,
    departure_location CHAR(3) NOT NULL,
    arrival_location CHAR(3) NOT NULL,
    departure_date DATE NOT NULL,
    arrival_date DATE NOT NULL,
    airline_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid BOOLEAN NOT NULL,
    PRIMARY KEY (flight_code, activation_code)
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    offer_id VARCHAR(100) NOT NULL,
    payed BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (offer_id) REFERENCES offers(flight_code)
);