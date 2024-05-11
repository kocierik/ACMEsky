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
	DepartureLocation string    `json:"departureLocation"`
	ArrivalLocation   string    `json:"arrivalLocation"`
	DepartureDatetime time.Time `json:"departureTime"`
	ArrivalDatetime   time.Time `json:"arrivalTime"`
	AirlineName       string    `json:"airlineName"`
	Price             float64   `json:"price"`
}

