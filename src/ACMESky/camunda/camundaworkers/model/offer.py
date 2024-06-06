import datetime
import uuid
from sqlalchemy import Column, String, DateTime, Float, UniqueConstraint, Integer, Boolean, ForeignKey
from camundaworkers.utils.db import Base
from camundaworkers.model.user import User
from camundaworkers.model.flight import Flight
from camundaworkers.model.user_interest import UserInterest

class Offer(Base):
    __tablename__ = 'offers'

    @staticmethod
    def from_dict(flight_id: str, user_id: str, interest_id: int):
        """
        Create a Offer object starting from the flight_id and the user_id
        :param flight_id: the id of the flight
        :param user_id: the id of the user
        :param interest_id: the id of the interest
        :return: a Offer object
        """
        return Offer(
            flight_id=flight_id,
            user_id=user_id,
            interest_id=interest_id,
            activation_code=str(uuid.uuid4())[:8],
            payed=False,
            created_at=datetime.datetime.utcnow()
        )

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey(User.id))
    flight_id = Column(String(5), ForeignKey(Flight.flight_code))
    interest_id = Column(Integer, ForeignKey(UserInterest.id))
    activation_code = Column(String(8))
    payed = Column(Boolean)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def __str__(self) -> str:
        return f"""Offer(
                id: {self.id}, 
                user_id: {self.user_id}, 
                flight_id: {self.flight_id},
                interest_id: {self.interest_id},
                activation_code: {self.activation_code},
                payed: {self.payed},
                created_at: {self.created_at}
                )"""
