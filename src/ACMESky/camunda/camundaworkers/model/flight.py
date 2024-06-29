from sqlalchemy import Column, String, DateTime, Float, Boolean
from camundaworkers.utils.db import Base

class Flight(Base):
    __tablename__ = 'flights'

    @staticmethod
    def from_dict(flight_dict: dict):
        """
        Create a Flight object starting from the flight_dict data
        :return: a Flight object
        """
        return Flight(
            flight_code=flight_dict.get('flightCode'),
            departure_location=flight_dict.get('departureLocation'),
            arrival_location=flight_dict.get('arrivalLocation'),
            departure_date=flight_dict.get('departureDate'),
            arrival_date=flight_dict.get('arrivalDate'),
            airline_name=flight_dict.get('airlineName'),
            price=flight_dict.get('price'),
            valid=True
        )

    flight_code = Column(String(10), primary_key=True)
    departure_location = Column(String(3))
    arrival_location = Column(String(3))
    departure_date = Column(DateTime)
    arrival_date = Column(DateTime)
    airline_name = Column(String(100))
    price = Column(Float)
    valid = Column(Boolean)


    def __str__(self) -> str:
        return f"""Flight(
                flight_code: {self.flight_code}, 
                departure_location: {self.departure_location},
                arrival_location: {self.arrival_location},
                departure_date: {self.departure_date}, 
                arrival_date: {self.arrival_date}, 
                airline_name: {self.airline_name},
                price: {self.price},
                valid: {self.valid}
                )"""
    
    def to_dict(self):
        return {
            'flight_code': self.flight_code,
            'departure_location': self.departure_location,
            'arrival_location': self.arrival_location,
            'departure_date': self.departure_date.isoformat(),
            'arrival_date': self.arrival_date.isoformat(),
            'airline_name': self.airline_name,
            'price': self.price,
            'valid': self.valid
        }
