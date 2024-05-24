from camundaworkers.model.purchase_process_information import PurchaseProcessInformation
import pika
import json
from camunda.external_task.external_task import ExternalTask, TaskResult
from camundaworkers.utils.logger import get_logger


def send_correct_offer_code(task: ExternalTask) -> TaskResult:
    """
    Sends the confirmation that the offer code inserted is valid to the user
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("send_correct_offer_code")

    user_communication_code = str(task.get_variable("user_communication_code"))

    # Connects to RabbitMQ and publishes the message
    connection = pika.BlockingConnection(pika.ConnectionParameters(host="acmesky_mq"))
    channel = connection.channel()
    channel.queue_declare(queue=user_communication_code, durable=True)
    success = PurchaseProcessInformation(message=f"Il codice offerta inserito è valido.",
                                         communication_code=user_communication_code)

    channel.basic_publish(
        exchange="",
        routing_key=user_communication_code,
        body=bytes(json.dumps(success.to_dict()), "utf-8"),
        properties=pika.BasicProperties(delivery_mode=2),
    )

    connection.close()

    return task.complete()
