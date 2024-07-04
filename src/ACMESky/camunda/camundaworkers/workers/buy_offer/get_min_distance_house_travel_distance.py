import json

from camunda.external_task.external_task import ExternalTask, TaskResult

from camundaworkers.utils.logger import get_logger
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

    GEOGRAPHICAL_DISTACE_SERVICE = environ.get("GEOGRAPHICAL_DISTACE_SERVICE", "http://geodistance_service:8040")

    offer_purchase_data = OfferPurchaseData.from_dict(json.loads(task.get_variable("offer_purchase_data")))

    travel_company = str(task.get_variable("travel_company"))
    travel_company_url = travel_company.split(';')[0]
    travel_company_address = travel_company.split(';')[1]
    travel_company_wsdl = travel_company.split(';')[2]


    endpoint = GEOGRAPHICAL_DISTACE_SERVICE + "/distance"
    params = f"?origins={travel_company_address}&destinations={offer_purchase_data.address}"
    distance_request = requests.get(endpoint + params).json()

    distances = json.loads(str(task.get_variable("distances")))
    distances.get("distances").append({"company": travel_company_url, "distance": distance_request['distance'], "wsdl": travel_company_wsdl})
    
    return task.complete(global_variables={"distances": json.dumps(distances)})
