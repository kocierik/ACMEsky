import datetime
import uuid
from sqlalchemy import Column, String, DateTime, Float, UniqueConstraint, Integer, Boolean
from camundaworkers.utils.db import Base

class Offer(Base):
    __tablename__ = 'offers'

    @staticmethod
    def from_dict(flight_id: str, user_id: str):
        """
        Create a Offer object starting from the flight_id and the user_id
        :param flight_id: the id of the flight
        :param user_id: the id of the user
        :return: a Offer object
        """
        return Offer(
            flight_id=flight_id,
            user_id=user_id,
            activation_code=str(uuid.uuid4())[:8],
            payed=False
        )

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey(User.id))
    flight_id = Column(String(100))
    activation_code = Column(String(8))
    payed = Column(Boolean)

    def __str__(self) -> str:
        return f"""Offer(
                id: {self.id}, 
                user_id: {self.user_id}, 
                flight_id: {self.flight_id},
                activation_code: {self.activation_code},
                payed: {self.payed}
                )"""
