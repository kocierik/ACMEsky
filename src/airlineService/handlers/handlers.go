package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/kocierik/ACMEsky/airlineService/models"
	"gorm.io/gorm"
	"net/http"
	"time"
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

	var ticket models.Ticket
	if err := h.DB.First(&ticket, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ticket not found"})
		return
	}

	c.JSON(http.StatusOK, ticket)
}

func (h handler) GetFlights(c *gin.Context) {
	departure := c.Query("departure")
	arrival := c.Query("arrival")
	departureDateStr := c.Query("departureDate")

	departureDate, err := time.Parse("2006-01-02", departureDateStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format"})
		return
	}

	var flights []models.Flight
	h.DB.Where("departure_code = ? AND arrival_code = ? AND DATE(departure_time) = ?", departure, arrival, departureDate.Format("2006-01-02")).Find(&flights)

	c.JSON(http.StatusOK, flights)
}
