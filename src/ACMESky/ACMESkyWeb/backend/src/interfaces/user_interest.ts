
export interface UserInterest {
  id: number;
  user_id: string;
  departure_location: string;
  arrival_location: string;
  from_date: Date;
  to_date: Date;
  max_price: number;
  valid: boolean;
}