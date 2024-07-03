#!/usr/bin/env bash

set -e

# Using a shell init script to be able to use environment variable substitution
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE TABLE airports (
      code CHAR(3) NOT NULL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      city VARCHAR(100) NOT NULL,
      coordinates VARCHAR(100) NOT NULL
  );

  CREATE TABLE flights (
      flight_code CHAR(7) NOT NULL PRIMARY KEY,
      departure_location CHAR(3) NOT NULL,
      arrival_location CHAR(3) NOT NULL,
      departure_date TIMESTAMP NOT NULL,
      arrival_date TIMESTAMP NOT NULL,
      airline_name VARCHAR(100) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      FOREIGN KEY (departure_location) REFERENCES airports(code),
      FOREIGN KEY (arrival_location) REFERENCES airports(code)
  );


  INSERT INTO airports (code, name, city, coordinates)
  VALUES
      ('AMS', 'Amsterdam Airport Schiphol', 'Amsterdam', '52.30860137939453, 4.763889312744141'),
      ('FRA', 'Frankfurt Airport', 'Frankfurt', '50.033333, 8.570556'),
      ('LHR', 'London Heathfield', 'London', '51.47779846191406, -0.46194122245788574'),
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


  INSERT INTO flights (flight_code, departure_location, arrival_location, departure_date, arrival_date, airline_name, price)
  VALUES
      ('${AIRLINE_PREFIX}41300', 'AMS', 'FRA', '2025-05-11 08:00:00', '2025-05-11 10:00:00', '${AIRLINE_NAME}', 250.00),
      ('${AIRLINE_PREFIX}21300', 'FRA', 'BRU', '2025-05-19 08:00:00', '2025-05-19 10:00:00', '${AIRLINE_NAME}', 250.00),
      ('${AIRLINE_PREFIX}76500', 'LHR', 'FRA', '2025-06-11 08:00:00', '2025-06-11 10:00:00', '${AIRLINE_NAME}', 250.00),
      ('${AIRLINE_PREFIX}64300', 'FRA', 'LHR', '2025-06-19 08:00:00', '2025-06-19 10:00:00', '${AIRLINE_NAME}', 250.00),
      ('${AIRLINE_PREFIX}18300', 'LHR', 'FRA', '2025-07-11 08:00:00', '2025-07-11 10:00:00', '${AIRLINE_NAME}', 250.00),
      ('${AIRLINE_PREFIX}83200', 'FRA', 'LHR', '2025-07-19 08:00:00', '2025-07-19 10:00:00', '${AIRLINE_NAME}', 250.00),
      ('${AIRLINE_PREFIX}12800', 'LHR', 'FRA', '2025-08-11 08:00:00', '2025-08-11 10:00:00', '${AIRLINE_NAME}', 250.00),
      ('${AIRLINE_PREFIX}11100', 'FRA', 'LHR', '2025-08-19 08:00:00', '2025-08-19 10:00:00', '${AIRLINE_NAME}', 250.00),
      ('${AIRLINE_PREFIX}11400', 'LHR', 'FRA', '2025-09-11 08:00:00', '2025-09-11 10:00:00', '${AIRLINE_NAME}', 250.00),
      ('${AIRLINE_PREFIX}11200', 'FRA', 'LHR', '2025-09-19 08:00:00', '2025-09-19 10:00:00', '${AIRLINE_NAME}', 250.00);

EOSQL