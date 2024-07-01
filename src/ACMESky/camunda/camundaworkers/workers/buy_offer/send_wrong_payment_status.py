from camunda.external_task.external_task import ExternalTask, TaskResult
from os import environ
import json
import requests
from camundaworkers.utils.logger import get_logger
from camundaworkers.utils.const import EventSSEType
from camundaworkers.model.payment_info import PaymentInfo


def send_wrong_payment_status(task: ExternalTask) -> TaskResult:
    """
    Notifies the user that the payment was not completed
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("send_wrong_payment_status")

    payment_info = PaymentInfo.from_dict(json.loads(task.get_variable("payment_status")))

    # Notifies the user that the payment was not completed
    url = f'{environ.get("ACMESKY_SSE_URL", "http://acmesky_sse:3000")}/send/{EventSSEType.ERROR.value}'
    body = {'userId': payment_info.user_id, 'message': 'Payment was not completed. Refresh the page and try again.'}
    requests.post(url, json=body, timeout=20)

    return task.complete()
