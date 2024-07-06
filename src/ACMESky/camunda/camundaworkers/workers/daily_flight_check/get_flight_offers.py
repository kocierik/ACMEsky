from camunda.external_task.external_task import ExternalTask, TaskResult
from camundaworkers.utils.logger import get_logger
import requests
from json import dumps
from datetime import datetime
import pytz

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

    new_flights = requests.get(url + "/flights").json()

    # Filter new_flights by taking only the flight that has a departure_date in the future
    today = datetime.now(pytz.timezone('Europe/Rome'))
    new_flights = [flight for flight in new_flights if datetime.fromisoformat(flight['departureDate']) > today]

    logger.info("Received %s new flights from today on", len(new_flights))
    return task.complete(global_variables={"flights": dumps(new_flights)})
