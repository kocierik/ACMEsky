package models

import (
	"time"
)

type Airport struct {
	ID          int    `json:"id"`
	Code        string `json:"code"`
	Name        string `json:"name"`
	City        string `json:"city"`
	Coordinates string `json:"coordinates"`
}

type Flight struct {
	ID                int       `json:"id"`
	FlightCode        string    `json:"flightCode"`
	DepartureLocation string    `json:"departureLocation"`
	ArrivalLocation   string    `json:"arrivalLocation"`
	DepartureDate 	  time.Time `json:"departureDate"`
	ArrivalDate   	  time.Time `json:"arrivalDate"`
	AirlineName       string    `json:"airlineName"`
	Price             float64   `json:"price"`
}

