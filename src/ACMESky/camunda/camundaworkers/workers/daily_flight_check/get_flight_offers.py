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

    global_vars: dict = {}
    stringified_flights = dumps(new_flights)

    if len(new_flights) > 0:
        # Workaround: Camunda string global variables can hold maximum 4000 chars per string.
        # Therefore we must split the dumped string every 3500 characters (just to be sure).
        flight_packets = (len(stringified_flights) // 3500) + 1
        global_vars["flight_packets"] = flight_packets
        for packet in range(flight_packets):
            start = packet * 3500
            end = start + 3500
            global_vars[f'flight_{packet}'] = stringified_flights[start:end]
    else:
        global_vars['flights'] = stringified_flights

    return task.complete(global_variables=global_vars)
