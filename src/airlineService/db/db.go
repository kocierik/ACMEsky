package db

import (
	"fmt"
	"log"
	// "os"

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

	USER := "pg"
	PSW := "pass"
	DB := "acmesky"
	// HOST := "postgres_back"
	// USER := os.Getenv("POSTGRES_USER")
	// PSW := os.Getenv("POSTGRES_PASSWORD")
	// DB := os.Getenv("POSTGRES_DB")
	// HOST := os.Getenv("POSTGRES_HOST")
	fmt.Print(USER, PSW, DB)
	dbURL := fmt.Sprintf("postgres://%s:%s@postgres_back:5432/%s", USER, PSW, DB)

	db, err := gorm.Open(postgres.Open(dbURL), &gorm.Config{})

	if err != nil {
		log.Fatalln(err)
	}

	db.AutoMigrate(&models.Flight{}, &models.Ticket{})

	return db
}
