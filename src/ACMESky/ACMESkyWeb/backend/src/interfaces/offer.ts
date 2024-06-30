export interface Offer {
  user_id: string;
  dep_flight_id: string;
  arr_flight_id: string;
  interest_id: number;
  activation_code: string;
  payed: boolean;
  created_at: Date;
}