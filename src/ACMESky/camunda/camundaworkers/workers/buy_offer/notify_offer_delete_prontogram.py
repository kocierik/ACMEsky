from camunda.external_task.external_task import ExternalTask, TaskResult
from sqlalchemy.orm import sessionmaker
import json
import requests

from camundaworkers.model.payment_info import PaymentInfo
from camundaworkers.model.flight import Flight
from camundaworkers.model.offer import Offer
from camundaworkers.utils.db import create_sql_engine
from camundaworkers.utils.logger import get_logger

def notify_offer_delete_prontogram(task: ExternalTask) -> TaskResult:
    """
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("verify_payment_status")

    payment_info = PaymentInfo.from_dict(json.loads(task.get_variable("payment_status")))

    # Gets the flights to buy
    flights = [Flight.from_dict(flight) for flight in payment_info.flights]
    flights_ids = [flight.flight_code for flight in flights]

    # Connects to PostgreSQL and update the offer entity
    Session = sessionmaker(bind=create_sql_engine())
    session = Session()

    # Retrieve all offers related to the bought flights
    offers_to_delete = session.query(Offer).filter(Offer.dep_flight_id.in_(flights_ids) | Offer.arr_flight_id.in_(flights_ids)).all()

    # Delete the offers from the database except the ones payed
    session.query(Offer).filter(Offer.dep_flight_id.in_(flights_ids) | Offer.arr_flight_id.in_(flights_ids)).filter(Offer.payed == False).delete()

    # Deletes the offer from the inbox on Prontogram
    for offer in offers_to_delete:    
        prontogram_message = {
            "user_id": offer.user_id,
            "activation_code": offer.activation_code
        }
        r = requests.delete("http://prontogram_backend:8050/api/offer", json=prontogram_message)
        logger.info(f"Prontogram response: {r.status_code}")
        if r.status_code >= 300:
            logger.warn(r.text)

    session.commit()
    return task.complete(global_variables={'payment_status_validity': True})

