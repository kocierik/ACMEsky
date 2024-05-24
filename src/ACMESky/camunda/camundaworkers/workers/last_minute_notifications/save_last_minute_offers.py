from camunda.external_task.external_task import ExternalTask, TaskResult
import json
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import DatabaseError

from camundaworkers.utils.db import create_sql_engine
from camundaworkers.model.flight import Flight
from camundaworkers.utils.logger import get_logger


def save_last_minute_offers(task: ExternalTask) -> TaskResult:
    """
    Saves the new flights received from a Flight Company on PostgreSQL
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("save_last_minute_offers")

    # Connects to PostgreSQL
    Session = sessionmaker(bind=create_sql_engine())
    session = Session()
    flights_dict = json.loads(task.get_variable("offers"))
    company_name = str(task.get_variable("company_name"))

    # Creates the list of flights to save
    flights = [Flight.from_dict(f, company_name) for f in flights_dict]

    try:
        session.add_all(flights)
        session.commit()
        logger.info(f"Added {len(flights)} flights to acmesky_db")
    except DatabaseError:
        logger.warn(f"Database error while inserting {len(flights)}")
        return task.bpmn_error(error_code='offer_saving_failed',
                               error_message='Error inserting rows in the database')

    return task.complete()
