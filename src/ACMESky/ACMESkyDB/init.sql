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
    flight_code CHAR(5) NOT NULL PRIMARY KEY,
    departure_location CHAR(3) NOT NULL,
    arrival_location CHAR(3) NOT NULL,
    departure_date DATE NOT NULL,
    arrival_date DATE NOT NULL,
    airline_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    valid BOOLEAN NOT NULL
);

CREATE TABLE offers (
    user_id INT NOT NULL,
    flight_id CHAR(5) NOT NULL,
    interest_id INT NOT NULL,
    activation_code CHAR(8) NOT NULL,
    payed BOOLEAN NOT NULL,
    bankurl VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, flight_id, interest_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (flight_id) REFERENCES flights(flight_code),
    FOREIGN KEY (interest_id) REFERENCES user_interests(id)
);


INSERT INTO flights (flight_code, departure_location, arrival_location, departure_date, arrival_date, airline_name, price, valid)
VALUES
    ('SA413', 'AMS', 'FRA', '2024-05-11 08:00:00', '2024-05-11 10:00:00', 'Sample Airlines', 250.00, true),
    ('SA213', 'FRA', 'BRU', '2024-05-19 08:00:00', '2024-05-19 10:00:00', 'Sample Airlines', 250.00, true),
    ('SA765', 'LHR', 'FRA', '2024-06-11 08:00:00', '2024-06-11 10:00:00', 'Sample Airlines', 250.00, true),
    ('SA643', 'FRA', 'LHR', '2024-06-19 08:00:00', '2024-06-19 10:00:00', 'Sample Airlines', 250.00, true),
    ('SA183', 'LHR', 'FRA', '2024-07-11 08:00:00', '2024-07-11 10:00:00', 'Sample Airlines', 250.00, true),
    ('SA832', 'FRA', 'LHR', '2024-07-19 08:00:00', '2024-07-19 10:00:00', 'Sample Airlines', 250.00, true),
    ('SA128', 'LHR', 'FRA', '2024-08-11 08:00:00', '2024-08-11 10:00:00', 'Sample Airlines', 250.00, true),
    ('SA111', 'FRA', 'LHR', '2024-08-19 08:00:00', '2024-08-19 10:00:00', 'Sample Airlines', 250.00, true),
    ('SA114', 'LHR', 'FRA', '2024-09-11 08:00:00', '2024-09-11 10:00:00', 'Sample Airlines', 250.00, true),
    ('SA112', 'FRA', 'LHR', '2024-09-19 08:00:00', '2024-09-19 10:00:00', 'Sample Airlines', 250.00, true);

