from datetime import datetime
import javaobj.v2 as javaobj
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.exc import NoResultFound
from camunda.external_task.external_task import ExternalTask, TaskResult

from camundaworkers.utils.logger import get_logger

from camundaworkers.utils.db import create_sql_engine
from camundaworkers.model.offer import Offer
from camundaworkers.model.flight import Flight

def check_offers_presence(task: ExternalTask) -> TaskResult:
    """
    Checks if some interest matches one or more flights previously saved on PostgreSQL.
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("check_offers_presence")

    # {'user_id': int, 'interests': [UserInterest]}
    user_interests = task.get_variable("user_interests")

    logger.info("user_id: %s", user_interests.get("user_id"))
    logger.info("user_interests: %s", user_interests.get("interests"))

    # Creating a session for PostgreSQL
    Session = sessionmaker(bind=create_sql_engine())
    session = Session()

    offers: list[Offer] = []

    for interest in user_interests.get("interests"):
        # Check if there is a match between the user interests and the flights. The match happen when given a user_interest:
        # 1. There is a flight X which go from user_interest.departure_location to user_interest.arrival_location and X.departure_date is in the range of user_interest.from_date and user_interest.to_date and
        # 2. There is also a flight Y which go from user_interest.arrival_location to user_interest.departure_location in the range of X.arrival_date and user_interest.to_date and
        # 3. The sum of X.price and Y.price is lower than user_interest.max_price
        departure_location: str = interest.get("departure_location")
        arrival_location: str = interest.get("arrival_location")
        from_date: datetime = datetime.fromisoformat(interest.get("from_date"))
        to_date: datetime = datetime.fromisoformat(interest.get("to_date"))
        max_price: float = interest.get("max_price")

        # Retrieving all the flights which go from the departure location to the arrival location in the range of the user interest
        departure_location_flights: list[Flight] = session.query(Flight).filter(Flight.valid == True).filter(Flight.departure_location == departure_location, Flight.arrival_location == arrival_location, Flight.departure_date >= from_date, Flight.departure_date <= to_date).all()

        for flight in departure_location_flights:
            return_flights = session.query(Flight).filter(Flight.valid == True) \
                .filter(Flight.departure_location == arrival_location, Flight.arrival_location == departure_location) \
                .filter(Flight.departure_date > flight.arrival_date, Flight.arrival_date <= to_date) \
                .filter(Flight.price <= max_price - flight.price) \
                .all()

            for return_flight in return_flights:
                try:
                    session.query(Offer).filter(Offer.dep_flight_id == flight.flight_code, Offer.arr_flight_id == return_flight.flight_code, Offer.user_id == user_interests.get("user_id"), Offer.interest_id == interest.get("id")).one()
                except NoResultFound:
                    offer = Offer.create(flight.flight_code, return_flight.flight_code, user_interests.get("user_id"), interest.get("id"))
                    session.add(offer)
                    offers.append(offer.to_dict())

    session.commit()
    logger.info("Offers: %s", offers)
    return task.complete(global_variables={
        "offers": offers
    })
