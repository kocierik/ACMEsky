CREATE TABLE users (
    id CHAR(36) PRIMARY KEY NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE user_interests (
    id SERIAL PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    departure_location CHAR(3) NOT NULL,
    arrival_location CHAR(3) NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    max_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE airline_service (
    name VARCHAR(100) NOT NULL PRIMARY KEY,
    endpoint VARCHAR(255) NOT NULL
);

CREATE TABLE flights (
    flight_code CHAR(7) NOT NULL PRIMARY KEY,
    departure_location CHAR(3) NOT NULL,
    arrival_location CHAR(3) NOT NULL,
    departure_date TIMESTAMP NOT NULL,
    arrival_date TIMESTAMP NOT NULL,
    airline_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    valid BOOLEAN NOT NULL,
    FOREIGN KEY (airline_name) REFERENCES airline_service(name)
);

CREATE TABLE offers (
    user_id CHAR(36) NOT NULL,
    dep_flight_id CHAR(7) NOT NULL,
    arr_flight_id CHAR(7) NOT NULL,
    interest_id INT NOT NULL,
    activation_code CHAR(8) NOT NULL,
    payed BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, dep_flight_id, arr_flight_id, interest_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (dep_flight_id) REFERENCES flights(flight_code),
    FOREIGN KEY (arr_flight_id) REFERENCES flights(flight_code),
    FOREIGN KEY (interest_id) REFERENCES user_interests(id)
);

INSERT INTO airline_service (name, endpoint) VALUES
    ('American Airlines', 'http://airline_service_1:8085'),
    ('Emic Airlines', 'http://airline_service_2:8085');
