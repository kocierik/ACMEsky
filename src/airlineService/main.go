package main

import (
	"log"

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

	log.Println("AIRLINE SERVICE API is running!")
	router.Run(":8085")
}
