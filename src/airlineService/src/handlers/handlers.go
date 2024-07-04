package handlers

import (
	"log"
	"math"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kocierik/ACMEsky/airlineService/models"
	"github.com/kocierik/ACMEsky/airlineService/services"
	"golang.org/x/exp/rand"
	"gorm.io/gorm"
)

type handler struct {
	DB *gorm.DB
}

func New(db *gorm.DB) handler {
	return handler{db}
}

func (h handler) GetFlights(c *gin.Context) {
	var flights []models.Flight
	h.DB.Find(&flights)

	c.JSON(http.StatusOK, flights)
}

func (h handler) GetAirports(c *gin.Context) {
	airport_codes := c.QueryArray("codes")

	var airports []models.Airport
	// If airport_codes is empty, return all airports
	if len(airport_codes) == 0 {
		h.DB.Find(&airports)
	} else {
		h.DB.Where("code IN (?)", airport_codes).Find(&airports)
	}

	c.JSON(http.StatusOK, airports)
}

func (h handler) CreateFlight(c *gin.Context) {
	var flight models.Flight
	flight.AirlineName = os.Getenv("AIRLINE_NAME")

	if err := c.ShouldBindJSON(&flight); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

// Aggiungi il volo al database
	if err := h.DB.Create(&flight).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create flight"})
		return
	}

	// Notifica ACMESKY
	services.FlightNotifier([]models.Flight{flight})

	c.JSON(http.StatusCreated, flight)
}

func (h handler) BuyFlight(c *gin.Context) {
	flightID := c.Param("id")
	if flightID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Flight ID required"})
		return
	}
	
	if err := h.DB.Unscoped().Where("flight_code = ?", flightID).Delete(&models.Flight{}).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Flight not found"})
		return
	}
}

func (h handler) CreateRandomFlight() {
	departureDate := randomDate()

	// Generate random flight data
	flight := models.Flight{
		FlightCode:        os.Getenv("AIRLINE_PREFIX") + randomCode(5),
		DepartureLocation: randomAirportCode(),
		ArrivalLocation:   randomAirportCode(),
		DepartureDate:     departureDate,
		ArrivalDate:       departureDate.Add(3 * time.Hour),
		AirlineName:       os.Getenv("AIRLINE_NAME"),
		Price:             randomPrice(),
	}

	// Add the flight to the database
	if err := h.DB.Create(&flight).Error; err != nil {
		log.Println("Failed to create flight:", err)
		return
	}

	// Notify ACMESKY
	services.FlightNotifier([]models.Flight{flight})

	log.Println("New flight created and notified to ACMESKY:", flight.FlightCode)
}

func randomCode(n int) string {
	const letters = "1234567890"
	b := make([]byte, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

func randomAirportCode() string {
	airportCodes := []string{
		"AMS", "FRA", "LHR", "CDG", "TXL", "ROM", "LBA", "BHX", "LTN", "WAW",
		"BRU", "MUC", "VIE", "DUS", "HAM", "MAD", "BCN", "SXF", "PRG",
	}
	return airportCodes[rand.Intn(len(airportCodes))]
}

func randomDate() time.Time {
	now := time.Now()
	// Generate a random date within the next year
	randomDuration := time.Duration(rand.Int63n(int64(time.Hour) * 24 * 365))
	return now.Add(randomDuration)
}

func randomPrice() float64 {
	// Generate a random price between 50 and 1000 with two decimal places
	price := 100 + rand.Float64()*(1000-100)
	return math.Round(price*100) / 100 // Round to two decimal places
}
