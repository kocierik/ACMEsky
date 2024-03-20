package models

import (
	"time"
)

type Flight struct {
	ID                int       `json:"id"`
	DepartureLocation string    `json:"departureCode"`
	ArrivalLocation   string    `json:"arrivalLocation"`
	DepartureCode     string    `json:"departureLocation"`
	DepartureTime     time.Time `json:"departureTime"`
	ArrivalTime       time.Time `json:"arrivalTime"`
	ArrivalCode       string    `json:"arrivalCode"`
	ExpDate           time.Time `json:"expDate"`
	AirlineName       string    `json:"airlineName"`
	Price             float64   `json:"price"`
}

type Ticket struct {
	ID      int    `json:"id"`
	Details string `json:"details"`
	// Add more fields as needed
}
