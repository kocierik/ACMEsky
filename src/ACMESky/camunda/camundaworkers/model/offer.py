from datetime import datetime
import uuid
from sqlalchemy import Column, String, DateTime, Integer, Boolean, ForeignKey, UniqueConstraint
from camundaworkers.utils.db import Base
from camundaworkers.model.user import User
from camundaworkers.model.flight import Flight
from camundaworkers.model.user_interest import UserInterest

class Offer(Base):
    __tablename__ = 'offers'
    __table_args__ = (
        UniqueConstraint('user_id', 'dep_flight_id', 'arr_flight_id', 'interest_id'),
    )

    @staticmethod
    def create(dep_flight_id: str, arr_flight_id: str, user_id: str, interest_id: int):
        """
        Create a Offer object starting from the flight_id and the user_id
        :param dep_flight_id: the id of the departure flight
        :param arr_flight_id: the id of the arrival flight
        :param user_id: the id of the user
        :param interest_id: the id of the interest
        :return: a Offer object
        """
        return Offer(
            dep_flight_id=dep_flight_id,
            arr_flight_id=arr_flight_id,
            user_id=user_id,
            interest_id=interest_id,
            activation_code=str(uuid.uuid4())[:8],
            payed=False,
            created_at=datetime.utcnow()
        )
    
    @staticmethod
    def from_dict(offer_dict: dict):
        """
        Create a Offer object starting from data contained in a dictionary
        :param offer_dict: a dictionary which contains the offer data
        :return: a Offer object
        """
        return Offer(
            dep_flight_id=offer_dict['dep_flight_id'],
            arr_flight_id=offer_dict['arr_flight_id'],
            user_id=offer_dict['user_id'],
            interest_id=offer_dict['interest_id'],
            activation_code=offer_dict['activation_code'],
            payed=offer_dict['payed'],
            created_at=datetime.fromisoformat(offer_dict['created_at'])
        )

    user_id = Column(String(36), ForeignKey(User.id), primary_key=True)
    dep_flight_id = Column(String(7), ForeignKey(Flight.flight_code), primary_key=True)
    arr_flight_id = Column(String(7), ForeignKey(Flight.flight_code), primary_key=True)
    interest_id = Column(Integer, ForeignKey(UserInterest.id), primary_key=True)
    activation_code = Column(String(8))
    payed = Column(Boolean)
    created_at = Column(DateTime, default=datetime.utcnow)

    def __str__(self) -> str:
        return f"""Offer(
                user_id: {self.user_id}, 
                dep_flight_id: {self.dep_flight_id},
                arr_flight_id: {self.arr_flight_id},
                interest_id: {self.interest_id},
                activation_code: {self.activation_code},
                payed: {self.payed},
                created_at: {self.created_at}
                )"""

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'dep_flight_id': self.dep_flight_id,
            'arr_flight_id': self.arr_flight_id,
            'interest_id': self.interest_id,
            'activation_code': self.activation_code,
            'payed': self.payed,
            'created_at': self.created_at.isoformat()
        }

