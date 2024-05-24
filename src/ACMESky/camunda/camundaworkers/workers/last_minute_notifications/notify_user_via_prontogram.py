from camunda.external_task.external_task import ExternalTask, TaskResult
import requests
import json

from camundaworkers.utils.logger import get_logger


def notify_user_via_prontogram(task: ExternalTask) -> TaskResult:
    """
    For each offer code, sends a message to the related ProntoGram user.
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("notify_user_via_prontogram")

    offer_codes = json.loads(task.get_variable("offer_codes"))
    offer_infos = json.loads(task.get_variable("offer_infos"))
    # Quotes are added at the beginning and end of the pg_username, [1:-1] removes them.
    prontogram_username = str(task.get_variable("prontogram_username"))[1:-1]
    logger.info(f"prontogram username: {prontogram_username}")
    logger.info(f"offer codes: {offer_codes}")

    for offer_code, offer_info in zip(offer_codes, offer_infos):
        prontogram_message = {
            "sender": "ACMESky",
            "receiver": prontogram_username,
            "body": f"ACMESky ha trovato per te la seguente offerta:\n{offer_info}\nInserisci il codice offerta {offer_code} sul sito di ACMESky per poterne usufruire. Affrettati, sarà valido per sole 24 ore!"
        }

        # logger.info(json.dumps(prontogram_message))
        r = requests.post("http://prontogram_backend:8080/messages", json=prontogram_message)

        logger.info(f"ProntoGram response: {r.status_code}")
        if r.status_code >= 300:
            logger.warn(r.text)
    return task.complete()
