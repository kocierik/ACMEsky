from camunda.external_task.external_task import ExternalTask, TaskResult
from sqlalchemy.orm.session import sessionmaker
from camundaworkers.utils.db import create_sql_engine

from camundaworkers.utils.logger import get_logger

import json
import pika

from ACMESky.camunda.camundaworkers.model.offer import OfferMatch
from camundaworkers.model.offer_purchase_data import OfferPurchaseData


def send_tickets(task: ExternalTask) -> TaskResult:
    """
    Sends the tickets to the user
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("send_tickets")

    user_communication_code = str(task.get_variable("user_communication_code"))
    tickets = str(task.get_variable("tickets"))
    logger.info(f"Tickets: {tickets}")

    # Connects to RabbitMQ and publish the ticket
    connection = pika.BlockingConnection(pika.ConnectionParameters(host="acmesky_mq"))
    channel = connection.channel()
    channel.queue_declare(queue=user_communication_code, durable=True)

    channel.basic_publish(
        exchange="",
        routing_key=user_communication_code,
        body=bytes(tickets, "utf-8"),
        properties=pika.BasicProperties(delivery_mode=2),
    )

    connection.close()

    # Connects to PostgreSQL and deletes the purchased offer.
    Session = sessionmaker(bind=create_sql_engine())
    session = Session()
    offer_purchase_data = OfferPurchaseData.from_dict(json.loads(task.get_variable("offer_purchase_data")))
    to_delete = session.query(OfferMatch).get({"offer_code": offer_purchase_data.offer_code})
    session.delete(to_delete)
    # The following lines are commented (uncomment them and comment the previous two not to delete the offermatch from the database).
    # session.query(OfferMatch)\
    #     .filter(OfferMatch.offer_code == offer_purchase_data.offer_code)\
    #     .update({"blocked": False}, synchronize_session="fetch")
    session.commit()
    return task.complete()
