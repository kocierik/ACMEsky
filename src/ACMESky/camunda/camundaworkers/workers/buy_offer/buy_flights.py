from camunda.external_task.external_task import ExternalTask, TaskResult
from sqlalchemy.orm import sessionmaker
import requests
import json

from camundaworkers.model.airline_service import AirlineService
from camundaworkers.model.flight import Flight
from camundaworkers.model.payment_info import PaymentInfo
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

    payment_info = PaymentInfo.from_dict(json.loads(task.get_variable("payment_status")))

    # Connects to PostgreSQL
    Session = sessionmaker(bind=create_sql_engine())
    session = Session()

    # Gets the flights to buy
    flights = [Flight.from_dict(flight) for flight in payment_info.flights]
    airline_names = [flight.airline_name for flight in flights]

    # Retrieve airline service endpoint from AirlineService entity
    services = session.query(AirlineService).filter(AirlineService.name.in_(airline_names)).all()
    services_endpoints = {service.name: service.endpoint for service in services}

    # Contacts the Flight Company and buys the tickets
    for flight in flights:
        endpoint = services_endpoints[flight.airline_name]
        logger.info("Contacting flight company: %s at %s", flight.airline_name, endpoint)

        r = requests.post(endpoint+f"/flights/{flight.flight_code}/buy", json={ "user_id": payment_info.user_id })

        if r.status_code > 300:
            logger.error("Cannot buy flights tickets from %s", flight.airline_name)
            return task.failure("Failure", "Cannot buy flights tickets", 5, 30)
        logger.info(f"Tickets bought with status: {r.status_code}")
    
    # Set valid flag to false for all flights bought
    session.query(Flight).filter(Flight.flight_code.in_([flight.flight_code for flight in flights])).update({Flight.valid: False})

    tickets = {
        'payment': payment_info.to_dict(),
        'rent': {}
    }

    session.commit()
    return task.complete(global_variables={"total_amount": payment_info.amount, "tickets": json.dumps(tickets)})
