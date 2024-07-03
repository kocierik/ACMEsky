package main

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kocierik/ACMEsky/airlineService/db"
	"github.com/kocierik/ACMEsky/airlineService/handlers"
)

func main() {
	DB := db.Init()
	h := handlers.New(DB)

	router := gin.Default()
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Next()
	})

	router.GET("/airports", h.GetAirports)
	router.GET("/flights", h.GetFlights)
	router.POST("/flights", h.CreateFlight)

	// Set up a ticker to generate a new flight every 10 seconds
	ticker := time.NewTicker(10 * time.Second)
	quit := make(chan struct{})

	go func() {
		for {
			select {
			case <-ticker.C:
				h.CreateRandomFlight()
			case <-quit:
				ticker.Stop()
				return
			}
		}
	}()

	log.Println("AIRLINE SERVICE API is running!")
	router.Run(":8085")
}
