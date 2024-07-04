from sqlalchemy import Column, String, DateTime, Float, UniqueConstraint, Integer, ForeignKey

from camundaworkers.model.user import User
from camundaworkers.utils.db import Base

class UserInterest(Base):
    __tablename__ = 'user_interests'

    @staticmethod
    def from_dict(interest_dict: dict):
        """
        Create a UserInterest object starting from data contained in a dictionary
        :param interest_dict: a dictionary which contains the interest data
        :return: a UserInterest object
        """
        return UserInterest(
            user_id=interest_dict.get('user_id'),
            departure_location=interest_dict.get('departure_location'),
            arrival_location=interest_dict.get('arrival_location'),
            from_date=interest_dict.get('from_date'),
            to_date=interest_dict.get('to_date'),
            max_price=interest_dict.get('max_price'),
            valid=interest_dict.get('valid', True)
        )

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(36), ForeignKey(User.id), nullable=False)
    departure_location = Column(String(3), nullable=False)
    arrival_location = Column(String(3), nullable=False)
    from_date = Column(DateTime, nullable=False)
    to_date = Column(DateTime, nullable=False)
    max_price = Column(Float, nullable=False)
    valid = Column(Boolean, nullable=False, default=True)

    def __str__(self) -> str:
        return f"""UserInterest(
                id: {self.id},
                user_id: {self.user_id},
                departure_location: {self.departure_location},
                arrival_location: {self.arrival_location},
                from_date: {self.from_date},
                to_date: {self.to_date},
                max_price: {self.max_price}
                valid: {self.valid}
                )"""

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'departure_location': self.departure_location,
            'arrival_location': self.arrival_location,
            'from_date': self.from_date.isoformat(),
            'to_date': self.to_date.isoformat(),
            'max_price': self.max_price,
            'valid': self.valid
        }
