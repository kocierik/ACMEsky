from camunda.external_task.external_task import ExternalTask, TaskResult
from sqlalchemy.orm import sessionmaker
from sqlalchemy import or_
import requests
from camundaworkers.model.flight import Flight
from camundaworkers.model.offer import Offer
from camundaworkers.utils.db import create_sql_engine
from camundaworkers.utils.logger import get_logger

def notify_user_via_prontogram(task: ExternalTask) -> TaskResult:
    """
    Collect the offers and sends them to the user via ProntoGram
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("notify_user_via_prontogram")

    offers: list[Offer] = [Offer.from_dict(offer) for offer in task.get_variable("offers")]
    logger.info(f"offers length: {len(offers)}")

    # Connection and save on PostgreSQL
    Session = sessionmaker(bind=create_sql_engine())
    session = Session()

    for offer in offers:
        flights = session.query(Flight).filter(or_(Flight.flight_code == offer.dep_flight_id, Flight.flight_code == offer.arr_flight_id)).order_by(Flight.departure_date).all()
        flights_infos = [f"{flight.airline_name} \n"
                         f"{flight.departure_location} -> {flight.arrival_location} \n"
                         f"{flight.departure_date} -> {flight.arrival_date} \n"
                         f"{flight.price}€ \n" for flight in flights]
        flights_infos = "\n".join(flights_infos)

        prontogram_message = {
            "user_id": offer.user_id,
            "activation_code": offer.activation_code,
            "message": f"{flights_infos}"
        }

        r = requests.post("http://prontogram_backend:8050/api/offer", json=prontogram_message)

        logger.info(f"Prontogram response: {r.status_code}")
        if r.status_code >= 300:
            logger.warn(r.text)

    return task.complete()
