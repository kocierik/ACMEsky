export interface Offer {
  flight_code: string;
  activation_code: string;
  departure_location: string;
  arrival_location: string;
  departure_date: string; // Formato data come stringa (yyyy-mm-dd)
  arrival_date: string;   // Formato data come stringa (yyyy-mm-dd)
  airline_name: string;
  price: number;          // Prezzo come numero decimale
  created_at: string;     // Formato data come stringa (yyyy-mm-dd hh:mm:ss)
  valid: boolean;
}