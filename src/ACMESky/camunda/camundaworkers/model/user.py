from sqlalchemy import Column, String, DateTime, Float, UniqueConstraint, Integer, ForeignKey

from camundaworkers.utils.db import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(String(36), primary_key=True)
    email = Column(String(100))
    password = Column(String(255))


    def __str__(self) -> str:
        return f"""User(
                id: {self.id}, 
                email: {self.email}, 
                password: {self.password}
                )"""