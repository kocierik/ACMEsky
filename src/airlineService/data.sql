-- Crea la tabella dei voli
CREATE TABLE flights (
    id SERIAL PRIMARY KEY,
    departure_code VARCHAR(50) NOT NULL,
    departure_time TIMESTAMP NOT NULL,
    arrival_time TIMESTAMP NOT NULL,
    arrival_code VARCHAR(50) NOT NULL,
    exp_date TIMESTAMP NOT NULL,
    airline_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    details TEXT NOT NULL
);

INSERT INTO flights (departure_code, departure_time, arrival_time, arrival_code, exp_date, airline_name, price)
VALUES
    ('AAA', '2023-12-25 08:00:00', '2023-12-25 10:00:00', 'BBB', '2023-12-20 08:00:00', 'Sample Airlines', 250.00),
    ('CCC', '2023-12-26 09:00:00', '2023-12-26 11:00:00', 'DDD', '2023-12-21 09:00:00', 'Another Airlines', 300.00),
    ('EEE', '2023-12-27 10:00:00', '2023-12-27 12:00:00', 'FFF', '2023-12-22 10:00:00', 'Test Airlines', 200.00),
    ('GGG', '2023-12-28 11:00:00', '2023-12-28 13:00:00', 'HHH', '2023-12-23 11:00:00', 'Flight Testers', 180.00);

INSERT INTO tickets (details)
VALUES
    ('Dettagli del primo biglietto'),
    ('Dettagli del secondo biglietto'),
    ('Dettagli del terzo biglietto'),
    ('Dettagli del quarto biglietto');

