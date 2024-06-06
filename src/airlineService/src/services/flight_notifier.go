package services

import (
	"bytes"
	"encoding/json"
	"net/http"
	"os"

	"github.com/kocierik/ACMEsky/airlineService/models"
)

func FlightNotifier(flights []models.Flight) {
	flightsJson, err := json.Marshal(flights)
	if err != nil {
		panic(err)
	}

	acmesky_be := os.Getenv("ACMESKY_BE_URL")
	if acmesky_be == "" {
		acmesky_be = "http://localhost:3000/newFlight"
	}

	req, err := http.NewRequest("POST", acmesky_be, bytes.NewBuffer(flightsJson))
	if err != nil {
		panic(err)
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	println("New Flight notified to ACMESKY")

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		panic("Failed to notify user")
	}
}

