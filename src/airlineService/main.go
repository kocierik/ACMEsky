package main

import (
	"github.com/gin-gonic/gin"
	"github.com/kocierik/ACMEsky/airlineService/db"
	"github.com/kocierik/ACMEsky/airlineService/handlers"
	"log"
)

func main() {
	DB := db.Init()
	h := handlers.New(DB)

	router := gin.Default()

	router.GET("/getTickets", h.GetTicketByID)
	router.GET("/getFlights", h.GetFlights)

	log.Println("API is running!")
	router.Run(":8080")
}
