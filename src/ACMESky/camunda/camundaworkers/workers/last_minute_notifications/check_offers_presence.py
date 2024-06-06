from datetime import date
import javaobj.v2 as javaobj
from sqlalchemy.orm import sessionmaker
from camunda.external_task.external_task import ExternalTask, TaskResult

from camundaworkers.utils.logger import get_logger
from camundaworkers.utils.utils import comeback_match_offer_interest, departure_match_offer_interest, find_min_cost_flights_couple

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

    # Retrieving all the previously saved flights
    flights = session.query(Flight).all()

    offers: list[Offer] = []

    # TODO: Check if there is a match between the user interests and the flights
    # TODO: Create an Offer and save it on PostgreSQL and add it to the offers list
    for interest in user_interests:
        pass

    """
    for interest in user_interests:
        # Filter using the utils function departure_match_offer_interest and comeback_match_offer_interest
        outbound_flights = list(filter(lambda flight: departure_match_offer_interest(flight, interest), flights))
        comeback_flights = list(filter(lambda flight: comeback_match_offer_interest(flight, interest), flights))
        # logger.info(f"outbound_flights: {outbound_flights}")
        # logger.info(f"comeback_flights: {comeback_flights}")

        if len(outbound_flights) > 0 and len(comeback_flights) > 0:
            min_outbound_flight, min_comeback_flight = find_min_cost_flights_couple(outbound_flights, comeback_flights)

            if min_outbound_flight is not None and min_comeback_flight is not None and (min_outbound_flight.cost + min_comeback_flight.cost) <= float(interest.get("max_price")):
                # Generating the offer code related to this offer match.
                offer_code = sha256(f"{date.today().isoformat()} - {min_outbound_flight} - {min_comeback_flight}".encode()).hexdigest()[:10]

                new_match = OfferMatch(
                    offer_code=offer_code,
                    outbound_flight_id=min_outbound_flight.id,
                    comeback_flight_id=min_comeback_flight.id,
                )

                # Checks if the offer match (through the offer code) was already created 
                # (i.e. the offer code already exists).
                if offer_code not in interest["offer_codes"]:
                    # Checks if the offer match already exist, this could happen if another user 
                    # pushed an equivalent interest.  
                    previous_matches = session.query(OfferMatch).filter(OfferMatch.offer_code == offer_code).all()
                    if len(previous_matches) == 0:
                        session.add(new_match)

                    # Updates the MongoDB document adding the offer code to the user interest
                    interest["offer_codes"].append(offer_code)
                    update_result = interests_collection.update_one({
                            "_id": ObjectId(interest.get("interest_id"))
                        }, {
                        "$set": {
                            "offer_codes": interest.get("offer_codes")
                        }
                    })
                    logger.info(f"UPDATE MongoDB RESULT: {update_result.raw_result}")

                    # Adds the offer code to those that will be sent through ProntoGram and generates the message.
                    offer_codes.append(offer_code)
                    offer_infos.append(
                        f
                        Andata: da {min_outbound_flight.departure_airport_code} ({min_outbound_flight.departure_datetime}) a {min_outbound_flight.arrival_airport_code} ({min_outbound_flight.arrival_datetime}).
                        Ritorno: da {min_comeback_flight.departure_airport_code} ({min_comeback_flight.departure_datetime}) a {min_comeback_flight.arrival_airport_code} ({min_comeback_flight.arrival_datetime}).
                        Costo offerta: {(min_outbound_flight.cost + min_comeback_flight.cost)} €.
                        #
                    )
    """

    session.commit()
    logger.info("Offers: %s", offers)
    return task.complete(global_variables={
        "offers": offers
    })
