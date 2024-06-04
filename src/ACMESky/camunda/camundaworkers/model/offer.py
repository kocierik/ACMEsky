import datetime
import uuid
from sqlalchemy import Column, String, DateTime, Float, UniqueConstraint, Integer, Boolean
from camundaworkers.utils.db import Base

class Offer(Base):
    __tablename__ = 'offers'

    @staticmethod
    def from_dict(flight_dict: dict):
        """
        Create a Offer object starting from data contained in a dictionary related to a flight
        :param flight_dict: a dictionary which contains the flight data
        :return: a Offer object
        """
        return Offer(
            id=flight_dict.get('id'),
            flight_code=flight_dict.get('flightCode'),
            departure_location=flight_dict.get('departureLocation'),
            arrival_location=flight_dict.get('arrivalLocation'),
            departure_date=flight_dict.get('departureDate'),
            arrival_date=flight_dict.get('arrivalDate'),
            airline_name=flight_dict.get('airlineName'),
            price=flight_dict.get('price'),
            created_at= datetime.now(),
            valid=True,
            activation_code=str(uuid.uuid4())
        )

    id = Column(Integer, primary_key=True, autoincrement=True)
    flight_code = Column(String(10), nullable=False)
    activation_code = Column(String(100), nullable=False)
    departure_location = Column(String(3), nullable=False)
    arrival_location = Column(String(3), nullable=False)
    departure_date = Column(DateTime, nullable=False)
    arrival_date = Column(DateTime, nullable=False)
    airline_name = Column(String(100), nullable=False)
    price = Column(Float, nullable=False)
    created_at = Column(DateTime, nullable=False)
    valid = Column(Boolean, nullable=False)

    __table_args__ = (
        UniqueConstraint('flight_code'),
    )

    def __str__(self) -> str:
        return f"""Offer(
                id: {self.id},
                flight_code: {self.flight_code},
                activation_code: {self.activation_code},
                departure_location: {self.departure_location},
                arrival_location: {self.arrival_location},
                departure_date: {self.departure_date},
                arrival_date: {self.arrival_date},
                airline_name: {self.airline_name},
                price: {self.price},
                created_at: {self.created_at},
                valid: {self.valid}
                )"""
