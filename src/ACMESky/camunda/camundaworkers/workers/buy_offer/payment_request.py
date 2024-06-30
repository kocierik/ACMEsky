from camunda.external_task.external_task import ExternalTask, TaskResult
from sqlalchemy import or_
from sqlalchemy.orm.session import sessionmaker
from os import environ
import json
import requests

from camundaworkers.utils.const import EventSSEType
from camundaworkers.model.offer import Offer
from camundaworkers.model.flight import Flight
from camundaworkers.utils.db import create_sql_engine
from camundaworkers.utils.logger import get_logger
from camundaworkers.model.offer_purchase_data import OfferPurchaseData


def payment_request(task: ExternalTask) -> TaskResult:
    """
    Requests for a new payment session to the Payment Provider.
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("payment_request")

    offer_purchase_data = OfferPurchaseData.from_dict(
        json.loads(task.get_variable("offer_purchase_data"))
    )

    # Connecting to postgreSQL and getting the offer the user wants to purchase
    Session = sessionmaker(bind=create_sql_engine())
    session = Session()

    # Gets the flights from the offer
    flights = (
        session.query(Flight)
        .join(Offer, or_(Flight.flight_code == Offer.dep_flight_id, Flight.flight_code == Offer.arr_flight_id))
        .filter(Offer.activation_code == offer_purchase_data.offer_code)
        .all()
    )
    flights_cost = sum([flight.price for flight in flights])
    flights_companies = {flight.airline_name for flight in flights}
    companies_info = 'dalle compagnie ' + ', '.join(flights_companies) if len(flights_companies) > 1 else 'dalla compagnia ' + flights_companies.pop()

    # Sends the payment request generation to the Payment Provider and get back the URL to send to the user.
    payment_request_to_send = {
        "amount": flights_cost,
        "payment_receiver": "ACMESky",
        "offer_code": offer_purchase_data.offer_code,
        "description": f"Il costo totale dell'offerta è: € {flights_cost}. I biglietti verranno acquistati {companies_info}",
        "user_id": offer_purchase_data.user_id,
        "flights": [flight.to_dict() for flight in flights]
    }
    payment_provider_url = environ.get("PAYMENT_PROVIDER_URL", "http://bank_backend:3000")
    payment_response = requests.post(payment_provider_url + "/createPaymentUrl", json=payment_request_to_send).json()

    # Notifies the user with the payment URL
    url = f'{environ.get("ACMESKY_SSE_URL", "http://acmesky_sse:3000")}/send/{EventSSEType.PAYMENT_URL.value}'
    body = {'userId': offer_purchase_data.user_id, 'payment_url': payment_response['paymentUrl']}
    requests.post(url, json=body)

    return task.complete()
