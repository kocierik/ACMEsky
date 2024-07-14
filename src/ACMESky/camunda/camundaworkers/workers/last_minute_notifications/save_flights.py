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

    flights = ""
    if task.get_variable("flight_packets") is None:
        flights = str(task.get_variable("flights"))
    else:
        # Workaround: Camunda string global variables can hold maximum 4000 chars per string.
        # Therefore we must concatenate the dumped strings.
        flight_packets = int(task.get_variable("flight_packets"))
        for packet in range(flight_packets):
            flights += str(task.get_variable(f"flight_{packet}"))

    flights = [Flight.from_dict(f) for f in json.loads(flights)]

    # Connects to PostgreSQL
    Session = sessionmaker(bind=create_sql_engine())
    session = Session()

    for flight in flights:
        session.query(Flight).filter(Flight.flight_code == flight.flight_code). \
            with_for_update(). \
            one_or_none()
        session.merge(flight)

    try:
        session.commit()
        logger.info(f"Added/updated {len(flights)} flights to acmesky_db")
    except DatabaseError:
        logger.warn(f"Database error while inserting {len(flights)}")
        return task.bpmn_error(error_code='offer_saving_failed',
                               error_message='Error inserting rows in the database')

    return task.complete()
