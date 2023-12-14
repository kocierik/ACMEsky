package main

import (
	"github.com/gin-gonic/gin"
	"github.com/kellydunn/golang-geo"
	"log"
	"strconv"
)

func calculateDistance(c *gin.Context) {
	lat1, _ := strconv.ParseFloat(c.Param("lat1"), 64)
	lon1, _ := strconv.ParseFloat(c.Param("lon1"), 64)
	lat2, _ := strconv.ParseFloat(c.Param("lat2"), 64)
	lon2, _ := strconv.ParseFloat(c.Param("lon2"), 64)

	geoPoint1 := geo.NewPoint(lat1, lon1)
	geoPoint2 := geo.NewPoint(lat2, lon2)
	distance := geoPoint1.GreatCircleDistance(geoPoint2)

	response := gin.H{
		"distance_km": distance,
	}

	c.JSON(200, response)
}

func main() {
	router := gin.Default()
	router.GET("/distance/:lat1/:lon1/:lat2/:lon2", calculateDistance)

	log.Println("Server is running. Listening on PORT 8080...")
	log.Println("EXAMPLE REQUEST: http://localhost:8080/distance/40.7128/-74.0060/34.0522/-118.2437")

	router.Run(":8080")
}
