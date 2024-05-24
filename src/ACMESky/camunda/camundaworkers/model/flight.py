from sqlalchemy import Column, String, DateTime, Float, UniqueConstraint, Integer, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from camundaworkers.utils.db import Base

class Flight(Base):
    __tablename__ = 'flights'

    @staticmethod
    def from_dict(flight_dict: dict, flight_company: str):
        """
        Create a Flight object starting from data contained in a dictionary and specifying the Flight Company, used
        when one or more flights are got from a Flight Company
        :param flight_dict: a dictionary which contains the flight data
        :param flight_company: the flight company from which this flight comes from
        :return: a Flight object
        """
        return Flight(
            flight_code=flight_dict.get('flight_id'),
            departure_airport_code=flight_dict.get('departure_airport_code'),
            arrival_airport_code=flight_dict.get('arrival_airport_code'),
            cost=flight_dict.get('cost'),
            departure_datetime=flight_dict.get('departure_datetime'),
            arrival_datetime=flight_dict.get('arrival_datetime'),
            flight_company_name=flight_company
        )

    id = Column(Integer, primary_key=True, autoincrement=True)
    flight_code = Column(String(10))
    departure_airport_code = Column(String(3))
    arrival_airport_code = Column(String(3))
    cost = Column(Float)
    departure_datetime = Column(DateTime)
    arrival_datetime = Column(DateTime)
    flight_company_name = Column(String(50))

    __table_args__ = (
        UniqueConstraint('flight_code', 'departure_datetime'),
    )

    def __str__(self) -> str:
        return f"""Flight(
                id: {self.id}, 
                flight_code: {self.flight_code}, 
                departure_airport_code: {self.departure_airport_code},
                arrival_airport_code: {self.arrival_airport_code},
                cost: {self.cost}, 
                departure_datetime: {self.departure_datetime}, 
                arrival_datetime: {self.arrival_datetime}, 
                flight_company_name: {self.flight_company_name}
                )"""


class OfferMatch(Base):
    __tablename__ = 'offermatches'

    offer_code = Column(String(11), primary_key=True)
    creation_date = Column(DateTime, default=datetime.now(tz=timezone.utc))

    outbound_flight_id = Column(Integer, ForeignKey("flights.id"))
    outbound_flight = relationship("Flight", primaryjoin=outbound_flight_id == Flight.id)

    comeback_flight_id = Column(Integer, ForeignKey("flights.id"))
    comeback_flight = relationship("Flight", primaryjoin=comeback_flight_id == Flight.id)

    blocked = Column(Boolean, default=False)


class PaymentTransaction(Base):
    """In :class:`PaymentTransaction`, field :attr:`transaction_id` is an UUID,
    therefore a string in the form: 8-4-4-4-12,
    where 8, 4, 12 are the lengths of the strings that compose it.
    """

    __tablename__ = 'paymenttxs'

    transaction_id = Column(String(36), primary_key=True)

    status = Column(Boolean, default=False)

    @staticmethod
    def from_dict(data):
        """
        Create a PaymentTransaction starting from a dictionary
        :param data: dictionary which contains the data to create the PyamentTransaction
        :return: a new PaymentTransaction object
        """
        return PaymentTransaction(transaction_id=data.get("transaction_id"), status=data.get("status"))
