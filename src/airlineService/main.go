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

	router.GET("/flights", h.GetFlights)
	router.GET("/airports", h.GetAirports)

	log.Println("AIRLINE SERVICE API is running!")
	router.Run(":8085")
}
