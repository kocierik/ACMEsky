from camunda.external_task.external_task import ExternalTask, TaskResult
from sqlalchemy.orm.session import sessionmaker
from os import environ
import json
import requests

from camundaworkers.utils.logger import get_logger
from camundaworkers.model.offer_purchase_data import OfferPurchaseData
from camundaworkers.utils.const import EventSSEType


def send_tickets(task: ExternalTask) -> TaskResult:
    """
    Sends the tickets to the user
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("send_tickets")

    tickets = str(task.get_variable("tickets"))
    logger.info(f"Tickets: {tickets}")

    offer_purchase_data = OfferPurchaseData.from_dict(json.loads(task.get_variable("offer_purchase_data")))

    # Notifies the user that the payment was completed
    url = f'{environ.get("ACMESKY_SSE_URL", "http://acmesky_sse:3000")}/send/{EventSSEType.TICKETS.value}'
    body = {'userId': offer_purchase_data.user_id, 'message': 'Payment completed. Tickets sent', 'tickets': tickets}
    requests.post(url, json=body)

    return task.complete()
