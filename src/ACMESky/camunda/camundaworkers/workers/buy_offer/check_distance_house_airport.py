from camunda.external_task.external_task import ExternalTask, TaskResult

import csv
import json
import requests
from os import environ

from camundaworkers.model.payment_info import PaymentInfo
from camundaworkers.model.offer_purchase_data import OfferPurchaseData
from camundaworkers.utils.db import create_sql_engine
from camundaworkers.utils.logger import get_logger


def check_distance_house_airport(task: ExternalTask) -> TaskResult:
    """
    Checks if the distance (that we got when contacting the Geographical Distance service)
    is congruent with the transfer bundle.
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("check_distance_house_airport")

    GEOGRAPHICAL_DISTACE_SERVICE = environ.get("GEOGRAPHICAL_DISTACE_SERVICE", "http://geodistance_service:8040")

    offer_purchase_data = OfferPurchaseData.from_dict(json.loads(task.get_variable("offer_purchase_data")))
    payment_info = PaymentInfo.from_dict(json.loads(task.get_variable("payment_status")))
    
    airport_code = payment_info.flights[0]['departureLocation']

    # Find the address of the departure airport
    airport_address = None
    with open("./camundaworkers/airports.csv") as airports_file:
        reader = csv.reader(airports_file)
        for row in reader:
            if row[4] == airport_code:
                airport_address = row[1]
                break

    # Failure case: the airport cannot be found in the CSV.
    if not airport_address:
        logger.error(f"Cannot find airport associated with: {airport_code}")
        return task.complete(global_variables={"distance": "35"})  # 35 > 30, then the transfer won't be booked.

    endpoint = GEOGRAPHICAL_DISTACE_SERVICE + "/distance"
    params = f"?origins={airport_address}&destinations={offer_purchase_data.address}"
    distance_request = requests.get(endpoint + params).json()
    logger.info(distance_request)

    return task.complete(global_variables={"distance": distance_request["distance"]})
