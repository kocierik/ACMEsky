package db

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/kocierik/ACMEsky/airlineService/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Init() *gorm.DB {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	USER := os.Getenv("POSTGRES_USER")
	PSW := os.Getenv("POSTGRES_PASSWORD")
	DB := os.Getenv("POSTGRES_DB")
	dbURL := fmt.Sprintf("postgres://%s:%s@localhost:5433/%s", USER, PSW, DB)

	db, err := gorm.Open(postgres.Open(dbURL), &gorm.Config{})

	if err != nil {
		log.Fatalln(err)
	}

	db.AutoMigrate(&models.Flight{}, &models.Ticket{})

	return db
}
