
CREATE TABLE airports (
    id SERIAL PRIMARY KEY,
    code VARCHAR(3) NOT NULL,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    coordinates VARCHAR(100) NOT NULL
);

CREATE TABLE flights (
    id SERIAL PRIMARY KEY,
    departure_location VARCHAR(3) NOT NULL,
    arrival_location VARCHAR(3) NOT NULL,
    departure_datetime TIMESTAMP NOT NULL,
    arrival_datetime TIMESTAMP NOT NULL,
    airline_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (departure_location) REFERENCES airports(code),
    FOREIGN KEY (arrival_location) REFERENCES airports(code)
);


INSERT INTO airports (code, name, city, coordinates)
VALUES
    ('AMS', 'Amsterdam Airport Schiphol', 'Amsterdam', '52.30860137939453, 4.763889312744141'),
    ('FRA', 'Frankfurt Airport', 'Frankfurt', '50.033333, 8.570556'),
    ('LHR', 'London Heathfield', 'London', '51.47779846191406, -0.46194122245788574');
    ('CDG', 'Charles de Gaulle Airport', 'Paris', '49.01279830932617, 2.55'),
    ('TXL', 'Berlin Tegel Airport', 'Berlin', '52.5597, 13.2877'),
    ('ROM', 'Rome Ciampino Airport', 'Rome', '41.7994, 12.5949'),
    ('LBA', 'Leeds Bradford Airport', 'Leeds', '53.805599, -1.66056'),
    ('BHX', 'Birmingham Airport', 'Birmingham', '52.453899, -1.74847'),
    ('LTN', 'London Stansted Airport', 'London', '51.885998, 0.235'),
    ('WAW', 'Warsaw Chopin Airport', 'Warsaw', '52.1656990051, 20.9671001433'),
    ('BRU', 'Brussels Airport', 'Brussels', '50.9014015198, 4.48443984985'),
    ('MUC', 'Munich Airport', 'Munich', '48.3538017273, 11.7861000442'),
    ('VIE', 'Vienna International Airport', 'Vienna', '48.1102981567, 16.5697002411'),
    ('DUS', 'Dusseldorf International Airport', 'Dusseldorf', '51.221111, 6.776111'),
    ('HAM', 'Hamburg Airport', 'Hamburg', '53.6304010618, 9.98822975131'),
    ('MAD', 'Adolfo Suarez Madrid', 'Madrid', '40.471926, -3.56264'),
    ('BCN', 'Barcelona International Airport', 'Barcelona', '41.2971000671, 2.07846'),
    ('SXF', 'Berlin-Schoenefeld Airport', 'Berlin', '52.380001, 13.5225'),
    ('PRG', 'Prague Airport', 'Prague', '50.1008, 14.26');


INSERT INTO flights (departure_location, arrival_location, departure_datetime, arrival_datetime, airline_name, price)
VALUES
    ('AMS', 'FRA', '2024-05-11 08:00:00', '2024-05-11 10:00:00', 'Sample Airlines', 250.00),
    ('BRU', 'LHR', '2024-05-19 08:00:00', '2024-05-19 10:00:00', 'Sample Airlines', 250.00),
    ('LHR', 'FRA', '2024-06-11 08:00:00', '2024-06-11 10:00:00', 'Sample Airlines', 250.00),
    ('FRA', 'LHR', '2024-06-19 08:00:00', '2024-06-19 10:00:00', 'Sample Airlines', 250.00),
    ('LHR', 'FRA', '2024-07-11 08:00:00', '2024-07-11 10:00:00', 'Sample Airlines', 250.00),
    ('FRA', 'LHR', '2024-07-19 08:00:00', '2024-07-19 10:00:00', 'Sample Airlines', 250.00),
    ('LHR', 'FRA', '2024-08-11 08:00:00', '2024-08-11 10:00:00', 'Sample Airlines', 250.00),
    ('FRA', 'LHR', '2024-08-19 08:00:00', '2024-08-19 10:00:00', 'Sample Airlines', 250.00),
    ('LHR', 'FRA', '2024-09-11 08:00:00', '2024-09-11 10:00:00', 'Sample Airlines', 250.00),
    ('FRA', 'LHR', '2024-09-19 08:00:00', '2024-09-19 10:00:00', 'Sample Airlines', 250.00);

