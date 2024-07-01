from camunda.external_task.external_task import ExternalTask, TaskResult
from os import environ
import json
import requests
from camundaworkers.utils.logger import get_logger
from camundaworkers.utils.const import EventSSEType
from camundaworkers.model.offer_purchase_data import OfferPurchaseData


def send_wrong_offer_code(task: ExternalTask) -> TaskResult:
    """
    Notifies the user that the code is invalid or expired
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("send_wrong_offer_code")

    offer_purchase_data = OfferPurchaseData.from_dict(json.loads(task.get_variable("offer_purchase_data")))

    # Notifies the user that the code is invalid or expired
    url = f'{environ.get("ACMESKY_SSE_URL", "http://acmesky_sse:3000")}/send/{EventSSEType.ERROR.value}'
    body = {'userId': offer_purchase_data.user_id, 'message': 'Invalid or expired offer code.'}
    requests.post(url, json=body, timeout=20)

    return task.complete()