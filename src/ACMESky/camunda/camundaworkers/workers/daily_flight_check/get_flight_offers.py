from camunda.external_task.external_task import ExternalTask, TaskResult
from camundaworkers.utils.logger import get_logger
import requests
from json import dumps
from datetime import datetime
from sqlalchemy.orm import sessionmaker
import pytz

from camundaworkers.utils.db import create_sql_engine
from camundaworkers.model.flight import Flight

def get_flight_offers(task: ExternalTask) -> TaskResult:
    """
    Gets the flights from a Flight Company
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("get_flight_offers")

    url = task.get_variable("company")
    logger.info("Contacting: %s", url)

    # Connection and save on PostgreSQL
    Session = sessionmaker(bind=create_sql_engine())
    session = Session()

    new_flights = requests.get(url + "/flights").json()

    # Filter new_flights by taking only the flight that has a departure_date in the future
    today = datetime.now(pytz.timezone('Europe/Rome'))
    new_flights = [flight for flight in new_flights if datetime.fromisoformat(flight['departureDate']) > today]

    try:
        # Filter new_flights by taking only the flights that are not stored in the database
        flights_in_db = [flight[0] for flight in session.query(Flight.flight_code).all()]
        new_flights = [flight for flight in new_flights if flight['flightCode'] not in flights_in_db]
    except Exception as e:
        logger.error("Database error while retrieving users interests. Error: %s", e)
        return task.bpmn_error(error_code='',
                               error_message='Error retrieving users interests from the database')

    logger.info("Received %s new flights from today on", len(new_flights))
    return task.complete(global_variables={"flights": dumps(new_flights)})
