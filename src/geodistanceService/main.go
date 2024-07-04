package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type DistanceResponse struct {
	Status string `json:"status"`
	Rows   []struct {
		Elements []struct {
			Distance struct {
				Text  string `json:"text"`
				Value int    `json:"value"`
			} `json:"distance"`
		} `json:"elements"`
	} `json:"rows"`
}

func calculateDistance(w http.ResponseWriter, r *http.Request) {
	origin := r.URL.Query().Get("origins")
	destination := r.URL.Query().Get("destinations")

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Errore nel caricare il file .env")
	}

	apiKey := os.Getenv("API_KEY")

	url := fmt.Sprintf("https://api.distancematrix.ai/maps/api/distancematrix/json?origins=%s&destinations=%s&key=%s", origin, destination, apiKey)

	resp, err := http.Get(url)
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Failed to fetch distance", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	var distanceResp DistanceResponse
	if err := json.NewDecoder(resp.Body).Decode(&distanceResp); err != nil {
		log.Fatal(err)
		http.Error(w, "Failed to decode response", http.StatusInternalServerError)
		return
	}

	if distanceResp.Status != "OK" {
		http.Error(w, "Failed to get distance", http.StatusInternalServerError)
		return
	}

	if len(distanceResp.Rows) == 0 || len(distanceResp.Rows[0].Elements) == 0 {
		http.Error(w, "No distance found", http.StatusInternalServerError)
		return
	}

	distanceText := strings.Split(distanceResp.Rows[0].Elements[0].Distance.Text, " ")[0]

	response := map[string]string{"distance": distanceText}
	w.Header().Set("Content-Type", "application/json")

	// Aggiungi le intestazioni CORS
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	json.NewEncoder(w).Encode(response)
}

func main() {
	http.HandleFunc("/distance", calculateDistance)

	log.Println("Server is running. Listening on PORT 8040...")
	log.Println("EXAMPLE REQUEST: http://localhost:8040/distance?origins=bologna&destinations=milano")

	if err := http.ListenAndServe(":8040", nil); err != nil {
		log.Fatal(err)
	}
}
