package handlers

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/kocierik/ACMEsky/airlineService/models"
	"github.com/kocierik/ACMEsky/airlineService/services"
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
