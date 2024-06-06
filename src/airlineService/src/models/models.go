package models

import (
	"time"
)

type Airport struct {
	Code        string `json:"code" gorm:"primary_key"`
	Name        string `json:"name"`
	City        string `json:"city"`
	Coordinates string `json:"coordinates"`
}

type Flight struct {
	FlightCode        string    `json:"flightCode"`
	DepartureLocation string    `json:"departureLocation"`
	ArrivalLocation   string    `json:"arrivalLocation"`
	DepartureDate 	  time.Time `json:"departureDate"`
	ArrivalDate   	  time.Time `json:"arrivalDate"`
	AirlineName       string    `json:"airlineName"`
	Price             float64   `json:"price"`
}

