from camunda.external_task.external_task import ExternalTask, TaskResult
from camundaworkers.logger import get_logger
import requests
from json import dumps


def get_flight_offers(task: ExternalTask) -> TaskResult:
    """
    Gets the flights from a Flight Company
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("get_flight_offers")

    url = task.get_variable("company")
    logger.info("Contacting: " + url)

    new_flights = requests.get(url + "/flights/offers").json()

    # Workaround for Camunda limitation on the length of the string that can be saved as process variable.
    if new_flights == {}:
        logger.info(f"Empty json from the flight company at URL {url}")
        return task.complete({'offers_0': dumps([]), 'offers_packets': 1})
    else:
        # Workaround: Camunda string global variables can hold maximum 4000 chars per string.
        # Therefore we must split the dumped string every 3500 characters (just to be sure).
        stringified_flights = dumps(new_flights.get('flights'))
        offers_packets = (len(stringified_flights) // 3500) + 1
        global_vars = {'offers_packets': offers_packets}
        for packet in range(offers_packets):
            start = packet * 3500
            end = start + 3500
            global_vars[f'offers_{packet}'] = stringified_flights[start:end]
        return task.complete(global_variables=global_vars)
