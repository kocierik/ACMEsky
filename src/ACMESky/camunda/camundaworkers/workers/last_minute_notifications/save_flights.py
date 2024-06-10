import json
from camunda.external_task.external_task import ExternalTask, TaskResult
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import DatabaseError

from camundaworkers.utils.db import create_sql_engine
from camundaworkers.model.flight import Flight
from camundaworkers.utils.logger import get_logger


def save_flights(task: ExternalTask) -> TaskResult:
    """
    Saves the new flights received from a Flight Company on PostgreSQL
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("save_flights")

    flights = [Flight.from_dict(f) for f in json.loads(task.get_variable("flights"))]

    # Connects to PostgreSQL
    Session = sessionmaker(bind=create_sql_engine())
    session = Session()

    try:
        session.add_all(flights)
        session.commit()
        logger.info(f"Added {len(flights)} flights to acmesky_db")
    except DatabaseError:
        logger.warn(f"Database error while inserting {len(flights)}")
        return task.bpmn_error(error_code='offer_saving_failed',
                               error_message='Error inserting rows in the database')

    return task.complete()
