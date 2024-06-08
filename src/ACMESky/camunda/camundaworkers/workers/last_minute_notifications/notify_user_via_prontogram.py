from camunda.external_task.external_task import ExternalTask, TaskResult
import requests

from camundaworkers.model.offer import Offer
from camundaworkers.utils.logger import get_logger

def notify_user_via_prontogram(task: ExternalTask) -> TaskResult:
    """
    Collect the offers and sends them to the user via ProntoGram
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("notify_user_via_prontogram")

    offers: list[Offer] = [Offer.from_dict(offer) for offer in task.get_variable("offers")]
    logger.info(f"offers length: {len(offers)}")

    for offer in offers:
        prontogram_message = {
            "user_id": offer.user_id,
            "activation_code": offer.activation_code,
            "message": f"ACMESky ha trovato per te la seguente offerta:\nInserisci il codice offerta {offer.activation_code} sul sito di ACMESky per poterne usufruire. Affrettati, sarà valido per sole 24 ore!"
        }

        r = requests.post("http://prontogram_backend:8050/api/offer", json=prontogram_message)

        logger.info(f"Prontogram response: {r.status_code}")
        if r.status_code >= 300:
            logger.warn(r.text)

    return task.complete()
