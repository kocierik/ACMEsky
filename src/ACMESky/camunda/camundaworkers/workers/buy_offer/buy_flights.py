from camunda.external_task.external_task import ExternalTask, TaskResult
from sqlalchemy.orm import sessionmaker
import requests
import json

from camundaworkers.model.offer_purchase_data import OfferPurchaseData
from camundaworkers.utils.logger import get_logger
from camundaworkers.utils.db import create_sql_engine

def buy_flights(task: ExternalTask) -> TaskResult:
    """
    Contacts the Flight Company and buys the tickets related to the offer purchased.
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("buy_flights")

    offer_purchase_data = OfferPurchaseData.from_dict(json.loads(task.get_variable("offer_purchase_data")))
    logger.info("Offer code used:" + offer_purchase_data.offer_code)

    # Connects to PostgreSQL and gets the purchased offer
    Session = sessionmaker(bind=create_sql_engine())
    session = Session()
    
    # offer_match: OfferMatch = session.query(OfferMatch).get({"offer_code": offer_code})

    # # Buying the outbound and comeback tickets through the flight company API.
    # request = {
    #     "flight_requests": [
    #         {
    #             "flight_id": offer_match.outbound_flight.flight_code,
    #             "date": offer_match.outbound_flight.departure_datetime.strftime("%Y-%m-%dT%H:%M:%S.000Z")
    #         },
    #         {
    #             "flight_id": offer_match.comeback_flight.flight_code,
    #             "date": offer_match.comeback_flight.departure_datetime.strftime("%Y-%m-%dT%H:%M:%S.000Z")
    #         }
    #     ]
    # }

    # flight_company_url = offer_match.comeback_flight.flight_company_name
    # logger.info("Contacting flight company: " + flight_company_url)
    # r = requests.post(flight_company_url+"/flights/buy", json=request)

    # logger.info(f"Tickets bought with status: {r.status_code}")
    # if r.status_code > 300:
    #     logger.error("Cannot buy flights tickets")
    #     return task.failure("Failure", "Cannot buy flights tickets", 5, 30)

    # total_amount = offer_match.comeback_flight.cost + offer_match.outbound_flight.cost

    # tickets = {
    #     "communication_code": str(task.get_variable("user_communication_code")),
    #     "flights": {
    #         "outbound": {
    #             "flight_code": offer_match.outbound_flight.flight_code,
    #             "departureDatetime": offer_match.outbound_flight.departure_datetime.strftime("%Y-%m-%dT%H:%M:%S"),
    #             "arrivalDatetime": offer_match.outbound_flight.arrival_datetime.strftime("%Y-%m-%dT%H:%M:%S"),
    #             "departureAirportCode": offer_match.outbound_flight.departure_airport_code,
    #             "arrivalAirportCode": offer_match.outbound_flight.arrival_airport_code,
    #             "cost": offer_match.outbound_flight.cost
    #         },
    #         "comeback": {
    #             "flight_code": offer_match.comeback_flight.flight_code,
    #             "departureDatetime": offer_match.comeback_flight.departure_datetime.strftime("%Y-%m-%dT%H:%M:%S"),
    #             "arrivalDatetime": offer_match.comeback_flight.arrival_datetime.strftime("%Y-%m-%dT%H:%M:%S"),
    #             "departureAirportCode": offer_match.comeback_flight.departure_airport_code,
    #             "arrivalAirportCode": offer_match.comeback_flight.arrival_airport_code,
    #             "cost": offer_match.comeback_flight.cost
    #         }
    #     }
    # }

    return task.complete(global_variables={"total_amount": 10, "tickets": ""})
    # return task.complete(global_variables={"total_amount": total_amount, "tickets": json.dumps(tickets)})
