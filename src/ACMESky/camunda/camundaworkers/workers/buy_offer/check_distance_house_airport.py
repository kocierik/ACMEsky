from camunda.external_task.external_task import ExternalTask, TaskResult

import csv
import json
import requests
from os import environ

from sqlalchemy.orm import sessionmaker

from camundaworkers.model.offer_purchase_data import OfferPurchaseData
from camundaworkers.model.flight import OfferMatch
from camundaworkers.model.base import create_sql_engine
from camundaworkers.logger import get_logger


def check_distance_house_airport(task: ExternalTask) -> TaskResult:
    """
    Checks if the distance (that we got when contacting the Geographical Distance service)
    is congruent with the transfer bundle.
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("check_distance_house_airport")

    GEOGRAPHICAL_DISTACE_SERVICE = environ.get("GEOGRAPHICAL_DISTACE_SERVICE", "http://geographical_distances:8080")

    offer_purchase_data = OfferPurchaseData.from_dict(json.loads(task.get_variable("offer_purchase_data")))

    # Connects to postgreSQL and get the offer purchased
    Session = sessionmaker(bind=create_sql_engine())
    session = Session()
    offer_match: OfferMatch = session.query(OfferMatch).get({"offer_code": offer_purchase_data.offer_code})

    # Finds the name (used for the airport) of the departure airport
    airports_file = open("./camundaworkers/airports.csv", 'r')
    airports = csv.reader(airports_file)
    airport_address = None
    for row in airports:
        if row[4] == offer_match.outbound_flight.departure_airport_code:
            airport_address = row[1]
    airports_file.close()

    # Failure case: the airport cannot be found in the CSV.
    if not airport_address:
        logger.error(f"Cannot find airport associated with: {offer_match.outbound_flight.departure_airport_code}")
        return task.complete(global_variables={"distance": "35"})  # 35 > 30, then the transfer won't be booked.

    request = {
        "address_1": airport_address,
        "address_2": str(offer_purchase_data.address)
    }

    distance_request = requests.post(GEOGRAPHICAL_DISTACE_SERVICE + "/distance", json=request)
    return task.complete(global_variables={"distance": distance_request.text})
