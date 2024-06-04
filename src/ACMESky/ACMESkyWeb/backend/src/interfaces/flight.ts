export interface Flight {
  id: number;
  flight_code: string;
  departure_location: string;
  arrival_location: string;
  departure_date: Date;
  arrival_date: Date;
  airline_name: string;
  price: number;
}