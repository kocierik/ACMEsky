from camundaworkers.model.purchase_process_information import PurchaseProcessInformation
from camundaworkers.model.flight import Flight, OfferMatch, PaymentTransaction
from camundaworkers.model.base import create_sql_engine
from camunda.external_task.external_task import ExternalTask, TaskResult
from sqlalchemy.orm.session import sessionmaker
from camundaworkers.logger import get_logger
from camundaworkers.model.offer_purchase_data import OfferPurchaseData

import pika
from redis import Redis
import json
import requests
from os import environ


def payment_request(task: ExternalTask) -> TaskResult:
    """
    Requests for a new payment session to the Payment Provider.
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("payment_request")

    user_communication_code = str(task.get_variable("user_communication_code"))

    offer_purchase_data = OfferPurchaseData.from_dict(
        json.loads(task.get_variable("offer_purchase_data"))
    )

    offer_code = offer_purchase_data.offer_code

    # Connecting to postgreSQL and getting the offer the user wants to purchase
    Session = sessionmaker(bind=create_sql_engine())
    session = Session()
    offer_match = session.query(OfferMatch).filter(OfferMatch.offer_code == offer_code,
                                                   OfferMatch.blocked == True).first()

    # affected_rows == 1 by hypothesis.
    outbound_flight_id = offer_match.outbound_flight_id
    comeback_flight_id = offer_match.comeback_flight_id

    outbound_flight = session.query(Flight).filter(Flight.id == outbound_flight_id).first()
    comeback_flight = session.query(Flight).filter(Flight.id == comeback_flight_id).first()

    # Sends the payment request generation to the Payment Provider and get back the URL to send to the user.
    payment_request_to_send = {
        "amount": outbound_flight.cost + comeback_flight.cost,
        "payment_receiver": "ACMESky",
        "description": f"Il costo totale dell'offerta è: € {outbound_flight.cost + comeback_flight.cost}. I biglietti verranno acquistati dalla compagnia {outbound_flight.flight_company_name}.",
    }
    payment_provider_url = environ.get("PAYMENT_PROVIDER_URL", "http://payment_provider_backend:8080")
    payment_creation_response = requests.post(payment_provider_url + "/payments/request",
                                              json=payment_request_to_send).json()

    # Creates a payment transaction
    payment_tx = PaymentTransaction(transaction_id=payment_creation_response.get('transaction_id'))
    session.add(payment_tx)
    session.commit()

    # Connects to Redis and relate the transaction id to the process instance id
    redis_connection = Redis(host="acmesky_redis", port=6379, db=0)
    redis_connection.set(payment_creation_response.get('transaction_id'), task.get_process_instance_id())
    redis_connection.close()

    # Connects to RabbitMQ and communicate to the user the payment URL
    connection = pika.BlockingConnection(pika.ConnectionParameters(host="acmesky_mq"))
    channel = connection.channel()
    channel.queue_declare(queue=user_communication_code, durable=True)

    purchase_url = PurchaseProcessInformation(message=str(payment_creation_response.get('redirect_page')),
                                              communication_code=user_communication_code)

    channel.basic_publish(
        exchange="",
        routing_key=user_communication_code,
        body=bytes(json.dumps(purchase_url.to_dict()), "utf-8"),
        properties=pika.BasicProperties(delivery_mode=2),
    )

    connection.close()

    return task.complete()
