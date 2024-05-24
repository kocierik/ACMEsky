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
        )

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey(User.id))
    departure_location = Column(String(100))
    arrival_location = Column(String(100))
    from_date = Column(DateTime)
    to_date = Column(DateTime)
    max_price = Column(Float)
    
    __table_args__ = (
        UniqueConstraint('user_id', 'departure_location', 'arrival_location', 'from_date', 'to_date', 'max_price'),
    )


    def __str__(self) -> str:
        return f"""UserInterest(
                id: {self.id}, 
                user_id: {self.user_id}, 
                departure_location: {self.departure_location},
                arrival_location: {self.arrival_location},
                from_date: {self.from_date}, 
                to_date: {self.to_date}, 
                max_price: {self.max_price}
                )"""