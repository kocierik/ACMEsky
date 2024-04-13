import json

from camunda.external_task.external_task import ExternalTask, TaskResult

from camundaworkers.logger import get_logger
from camundaworkers.model.offer_purchase_data import OfferPurchaseData

from os import environ
import requests
import json


def get_min_distance_house_travel_distance(task: ExternalTask) -> TaskResult:
    """
    Gets the distance between the user's house and a travel company.
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("get_min_distance_house_travel_distance")

    GEOGRAPHICAL_DISTACE_SERVICE = environ.get("GEOGRAPHICAL_DISTACE_SERVICE", "http://geographical_distances:8080")

    travel_company = str(task.get_variable("travel_company"))
    travel_company_url = travel_company.split(';')[0]
    travel_company_address = travel_company.split(';')[1]
    offer_purchase_data = OfferPurchaseData.from_dict(json.loads(task.get_variable("offer_purchase_data")))

    distances = json.loads(str(task.get_variable("distances")))

    request = {
        "address_1": travel_company_address,
        "address_2": str(offer_purchase_data.address)
    }

    distance_request = requests.post(GEOGRAPHICAL_DISTACE_SERVICE + "/distance", json=request)

    distances.get("distances").append({"company": travel_company_url, "distance": distance_request.text})
    return task.complete(global_variables={"distances": json.dumps(distances)})
