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

-- TODO: REMOVE
-- Inseriti per fare i test con dei voli
-- In particolare il codice offerta e' da prendere il backend di prontogram

INSERT INTO users (email, password) VALUES
('johndoe@example.com', 'password123'),
('jane.smith@example.com', 'password456'),
('alice.wonderland@example.com', 'password789');

INSERT INTO user_interests (user_id, departure_location, arrival_location, from_date, to_date, max_price) VALUES
(1, 'JFK', 'LAX', '2024-07-01', '2024-07-10', 300.00),
(2, 'LHR', 'CDG', '2024-08-15', '2024-08-20', 200.00),
(3, 'ORD', 'MIA', '2024-09-01', '2024-09-05', 150.00);


INSERT INTO flights (flight_code, departure_location, arrival_location, departure_date, arrival_date, airline_name, price, valid) VALUES
('AB123', 'JFK', 'LAX', '2024-07-02', '2024-07-02', 'AirlineA', 250.00, TRUE),
('CD456', 'LHR', 'CDG', '2024-08-16', '2024-08-16', 'AirlineB', 180.00, TRUE);


INSERT INTO offers (user_id, flight_id, interest_id, activation_code, payed, bankurl) VALUES
(1, 'CD456', 2, 'ACTCODE2', FALSE, 'http://bankurl.com/payment2');
