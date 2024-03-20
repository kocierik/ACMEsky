package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kocierik/ACMEsky/airlineService/models"
	"gorm.io/gorm"
)

type handler struct {
	DB *gorm.DB
}

func New(db *gorm.DB) handler {
	return handler{db}
}

func convertToInt(s string) int {
	result := 0
	for _, ch := range s {
		result = result*10 + int(ch-'0')
	}
	return result
}

func (h handler) GetTicketByID(c *gin.Context) {
	ticketID := c.Query("id")
	id := 0
	if ticketID != "" {
		id = convertToInt(ticketID)
	}

	var flights []models.Flight
	if err := h.DB.First(&flights, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ticket not found"})
		return
	}

	c.JSON(http.StatusOK, flights)
}

func (h handler) GetFlights(c *gin.Context) {
	departure := c.Query("departure")
	arrival := c.Query("arrival")
	departureDateStr := c.Query("departureDate")
	arrivalDateStr := c.Query("arrivalDate")

	departureDate, err := time.Parse("2006-01-02", departureDateStr)
	arrivalDate, err2 := time.Parse("2006-01-02", arrivalDateStr)

	if err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format"})
		return
	}
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format"})
		return
	}

	var flights []models.Flight
	h.DB.Where("departure_location = ? AND arrival_location = ? AND DATE(departure_time) = ? AND DATE(arrival_time)", departure, arrival, departureDate.Format("2006-01-02"), arrivalDate.Format("2006-01-02")).Find(&flights)

	c.JSON(http.StatusOK, flights)
}

func (h handler) CreateFlight(c *gin.Context) {
	var flight models.Flight
	if err := c.ShouldBindJSON(&flight); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Aggiungi il volo al database
	if err := h.DB.Create(&flight).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create flight"})
		return
	}

	c.JSON(http.StatusCreated, flight)
}
