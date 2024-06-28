export interface Offer {
  user_id: number;
  flight_id: string;
  interest_id: number;
  activation_code: string;
  payed: boolean;
  created_at: Date;
}