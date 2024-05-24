from datetime import date
from camunda.external_task.external_task import ExternalTask, TaskResult
import base64
import javaobj.v2 as javaobj
import json
from hashlib import sha256

from camundaworkers.utils.logger import get_logger
from camundaworkers.utils.utils import *

from camundaworkers.utils.db import create_sql_engine
from camundaworkers.model.flight import *
from sqlalchemy.orm import sessionmaker

from pymongo import MongoClient
from bson import ObjectId
from os import environ


def check_offers_presence(task: ExternalTask) -> TaskResult:
    """
    Checks if some interest matches one or more flights previously saved on PostgreSQL.
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("check_offers_presence")

    """
    task.get_variable('user') returns a marshalled base64 version of a java.util.HashMap
    Therefore it needs to be decoded, deserialized, stringified and split on \n since every property
    of the object seems to be on a different row.
    Rows:
    - 0: type and address
    - 1: class name
    - 2: hex code
    - 3: key _id
    - 4: value of _id
    - 5: key "interests"
    - 6: value of "interests"
    """
    deserialized_user = javaobj.loads(base64.b64decode(task.get_variable('user'))).dump().split('\n')

    prontogram_username = str(deserialized_user[4].replace('\t', ''))
    user_interests = json.loads(deserialized_user[6].replace('\t', '').replace('\'', '\"'))

    offer_codes = []
    offer_infos = []

    # Connecting to MongoDB
    username = environ.get("MONGO_USER", "root")
    password = environ.get("MONGO_PASSWORD", "password")
    client = MongoClient(f"mongodb://{username}:{password}@acmesky_mongo:27017")
    acmesky_db = client['ACMESky']
    interests_collection = acmesky_db['interests']

    # Creating a session for PostgreSQL
    Session = sessionmaker(bind=create_sql_engine())
    session = Session()

    # Retrieving all the previously savedflights
    offers = session.query(Flight).all()

    """
    Checks if some interest matches one or more flights.
    For each interest, the offers are filtered since we are looking for some matching offers: if we can find any, 
    then we get those with the minimum cost and later check if the total cost is above the maximum cost requested 
    by the user. If all goes well, a new OfferMatch with an unique offer code is created and saved into PostgreSQL.
    """
    for interest in user_interests:
        # Filter using the utils function departure_match_offer_interest and comeback_match_offer_interest
        outbound_flights = list(filter(lambda flight: departure_match_offer_interest(flight, interest), offers))
        comeback_flights = list(filter(lambda flight: comeback_match_offer_interest(flight, interest), offers))
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

                """
                Checks if the offer match (through the offer code) was already created 
                (i.e. the offer code already exists).
                """
                if offer_code not in interest["offer_codes"]:
                    """ 
                    Checks if the offer match already exist, this could happen if another user 
                    pushed an equivalent interest.  
                    """
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
                        f"""
                        Andata: da {min_outbound_flight.departure_airport_code} ({min_outbound_flight.departure_datetime}) a {min_outbound_flight.arrival_airport_code} ({min_outbound_flight.arrival_datetime}).
                        Ritorno: da {min_comeback_flight.departure_airport_code} ({min_comeback_flight.departure_datetime}) a {min_comeback_flight.arrival_airport_code} ({min_comeback_flight.arrival_datetime}).
                        Costo offerta: {(min_outbound_flight.cost + min_comeback_flight.cost)} €.
                        """
                    )

    session.commit()
    logger.info(f"Offer codes: {offer_codes}")
    return task.complete(global_variables={
        'offer_codes': json.dumps(offer_codes),
        'offer_infos': json.dumps(offer_infos),
        'prontogram_username': prontogram_username
    })
