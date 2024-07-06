from sqlalchemy.orm.session import sessionmaker
from camundaworkers.utils.db import create_sql_engine
from camundaworkers.model.payment_info import PaymentInfo
from camundaworkers.model.offer import Offer
from camunda.external_task.external_task import ExternalTask, TaskResult
from camundaworkers.utils.logger import get_logger

import json


def verify_payment_status(task: ExternalTask) -> TaskResult:
    """
    Verifies the payment status sent by the Payment Provider.
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("verify_payment_status")

    payment_info = PaymentInfo.from_dict(json.loads(task.get_variable("payment_status")))

    # Checks the payment status
    if not payment_info.payed:
        logger.error(f"The transaction {payment_info.process_instance_id} was not completed.")
        return task.complete(global_variables={'payment_status_validity': False})

    # Connects to PostgreSQL and update the offer entity
    Session = sessionmaker(bind=create_sql_engine())
    session = Session()

    affected_rows = session.query(Offer).filter(Offer.activation_code == payment_info.offer_code).update({Offer.payed: True})

    if affected_rows < 1:
        session.rollback()
        logger.error("0 matches were found for the given offer code %s", payment_info.offer_code)
        return task.complete(global_variables={'payment_status_validity': False})

    session.commit()
    return task.complete(global_variables={'payment_status_validity': True})
