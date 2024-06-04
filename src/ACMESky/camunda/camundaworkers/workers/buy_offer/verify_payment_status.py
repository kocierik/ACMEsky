from sqlalchemy.orm.session import sessionmaker
from camundaworkers.utils.db import create_sql_engine
from ACMESky.camunda.camundaworkers.model.offer import PaymentTransaction
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

    offer_purchase_data = PaymentTransaction.from_dict(json.loads(task.get_variable("payment_status")))

    # Checks the payment status
    if not offer_purchase_data.status:
        logger.error(f"The transaction {offer_purchase_data.transaction_id} was not completed.")
        return task.complete(global_variables={'payment_status_validity': False})

    # Connects to PostgreSQL and update the PaymentTransaction status
    Session = sessionmaker(bind=create_sql_engine())
    session = Session()

    affected_rows = session.query(PaymentTransaction).filter(
        PaymentTransaction.transaction_id == offer_purchase_data.transaction_id).update({"status": True},
                                                                                        synchronize_session="fetch")
    if affected_rows < 1:
        session.rollback()
        logger.error(f"{affected_rows} transactions were updated.")
        return task.complete(global_variables={'payment_status_validity': False})

    logger.info(f"{affected_rows} transaction was updated.")
    session.commit()
    return task.complete(global_variables={'payment_status_validity': True})
