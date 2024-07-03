from sqlalchemy import Column, String, DateTime, Float, UniqueConstraint, Integer, ForeignKey

from camundaworkers.utils.db import Base

class AirlineService(Base):
    __tablename__ = 'airline_service'

    name = Column(String(100), primary_key=True)
    endpoint = Column(String(255), nullable=False)

    def __str__(self) -> str:
        return f"""AirlineService(
                    name: {self.name},
                    endpoint: {self.endpoint}
                )"""
