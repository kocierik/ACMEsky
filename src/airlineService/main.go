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
	log.Println("EXAMPLE REQUEST: ")
	log.Println("http://localhost:8080/getFlights?departure=AAA&arrival=BBB&departureDate=2023-12-25")
	log.Println("http://localhost:8080/getTickets?id=1")
	router.Run(":8080")
}
