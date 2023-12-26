package main

import (
	"github.com/gin-gonic/gin"
	"github.com/kellydunn/golang-geo"
	"log"
	"strconv"
)

func calculateDistance(c *gin.Context) {

	// lat1 := c.Query("lat1")
	// lat2 := c.Query("lat2")
	// lon1 := c.Query("lon1")
	// lon2 := c.Query("lon2")

	lat1, _ := strconv.ParseFloat(c.Query("lat1"), 64)
	lon1, _ := strconv.ParseFloat(c.Query("lon1"), 64)
	lat2, _ := strconv.ParseFloat(c.Query("lat2"), 64)
	lon2, _ := strconv.ParseFloat(c.Query("lon2"), 64)

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
	router.GET("/distance", calculateDistance)

	log.Println("Server is running. Listening on PORT 8080...")
	log.Println("EXAMPLE REQUEST: http://localhost:8080/distance?lat1=40.7128&lon1=-74.0060&lat2=34.0522&lon2=-118.2437")

	router.Run(":8080")
}
