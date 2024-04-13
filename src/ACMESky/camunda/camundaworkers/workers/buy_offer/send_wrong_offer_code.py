from camundaworkers.model.purchase_process_information import PurchaseProcessInformation
from camunda.external_task.external_task import ExternalTask, TaskResult
import pika
import json
from camundaworkers.logger import get_logger


def send_wrong_offer_code(task: ExternalTask) -> TaskResult:
    """
    Notifies the user that the code is invalid, expired or already in use.
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("send_wrong_offer_code")

    user_communication_code = str(task.get_variable("user_communication_code"))

    # Connects to RabbitMQ and publishes the message
    connection = pika.BlockingConnection(pika.ConnectionParameters("acmesky_mq"))
    channel = connection.channel()

    channel.queue_declare(queue=user_communication_code, durable=True)

    error = PurchaseProcessInformation(
        message="Il codice offerta inserito non è valido, è in uso da parte di un altro utente o sono passate più di 24 ore da quando è stato inviato.",
        communication_code=user_communication_code,
        is_error=True,
    )

    channel.basic_publish(
        exchange="",
        routing_key=user_communication_code,
        body=bytes(json.dumps(error.to_dict()), "utf-8"),
        properties=pika.BasicProperties(delivery_mode=2),
    )

    connection.close()

    return task.complete()
