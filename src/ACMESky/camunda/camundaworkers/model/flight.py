from sqlalchemy import Column, String, Float, Boolean, TIMESTAMP as Timestamp, ForeignKey
from camundaworkers.utils.db import Base
from camundaworkers.model.airline_service import AirlineService


class Flight(Base):
    __tablename__ = "flights"

    @staticmethod
    def from_dict(flight_dict: dict) -> "Flight":
        """
        Create a Flight object starting from the flight_dict data
        :return: a Flight object
        """
        return Flight(
            flight_code=flight_dict.get("flightCode"),
            departure_location=flight_dict.get("departureLocation"),
            arrival_location=flight_dict.get("arrivalLocation"),
            departure_date=flight_dict.get("departureDate"),
            arrival_date=flight_dict.get("arrivalDate"),
            airline_name=flight_dict.get("airlineName"),
            price=flight_dict.get("price"),
            valid=True,
        )

    flight_code = Column(String(7), primary_key=True)
    departure_location = Column(String(3))
    arrival_location = Column(String(3))
    departure_date = Column(Timestamp)
    arrival_date = Column(Timestamp)
    airline_name = Column(String(100), ForeignKey(AirlineService.name))
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
            "flightCode": self.flight_code,
            "departureLocation": self.departure_location,
            "arrivalLocation": self.arrival_location,
            "departureDate": self.departure_date.isoformat(),
            "arrivalDate": self.arrival_date.isoformat(),
            "airlineName": self.airline_name,
            "price": self.price,
            "valid": self.valid,
        }