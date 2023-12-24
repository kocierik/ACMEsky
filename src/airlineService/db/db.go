package db

import (
	"log"

	"github.com/kocierik/ACMEsky/airlineService/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Init() *gorm.DB {
	dbURL := "postgres://pg:pass@db:5432/airline"

	db, err := gorm.Open(postgres.Open(dbURL), &gorm.Config{})

	if err != nil {
		log.Fatalln(err)
	}

	db.AutoMigrate(&models.Flight{}, &models.Ticket{})

	return db
}
