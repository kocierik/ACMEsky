import json
from os import environ
import requests
from camunda.external_task.external_task import ExternalTask, TaskResult

from camundaworkers.utils.logger import get_logger
from camundaworkers.utils.const import EventSSEType
from camundaworkers.model.offer_purchase_data import OfferPurchaseData


def send_timeout_request_payment(task: ExternalTask) -> TaskResult:
    """
    Notifies the user that the request payment has timed out.
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("send_timeout_request_payment")

    offer_purchase_data = OfferPurchaseData.from_dict(json.loads(task.get_variable("offer_purchase_data")))

    # Notifies the user that the payment has timed out
    url = f'{environ.get("ACMESKY_SSE_URL", "http://acmesky_sse:3000")}/send/{EventSSEType.ERROR.value}'
    body = {'userId': offer_purchase_data.user_id, 'message': 'Payment request timed out.'}
    requests.post(url, json=body, timeout=20)

    return task.complete()
