from camunda.external_task.external_task import ExternalTask, TaskResult
import json
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import DatabaseError

from camundaworkers.utils.db import create_sql_engine
from ACMESky.camunda.camundaworkers.model.offer import Offer
from camundaworkers.utils.logger import get_logger


def save_last_minute_offers(task: ExternalTask) -> TaskResult:
    """
    Saves the new offers received from a Flight Company on PostgreSQL
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("save_last_minute_offers")

    offers = [Offer.from_dict(f) for f in json.loads(task.get_variable("flights"))]

    # Connects to PostgreSQL
    Session = sessionmaker(bind=create_sql_engine())
    session = Session()

    try:
        session.add_all(offers)
        session.commit()
        logger.info(f"Added {len(offers)} offers to acmesky_db")
    except DatabaseError:
        logger.warn(f"Database error while inserting {len(offers)}")
        return task.bpmn_error(error_code='offer_saving_failed',
                               error_message='Error inserting rows in the database')

    return task.complete()
