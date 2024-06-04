from camunda.external_task.external_task import ExternalTask, TaskResult
import json
from sqlalchemy.orm import sessionmaker

from camundaworkers.utils.db import create_sql_engine
from camundaworkers.utils.logger import get_logger
from camundaworkers.model.user_interest import UserInterest


def register_interest(task: ExternalTask) -> TaskResult:
    """
    Saves the interest on PostgreSQL.
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("register_interest")

    user_interest_dict = json.loads(task.get_variable("interest"))
    user_interest = UserInterest.from_dict(user_interest_dict)

    # Connection and save on PostgreSQL
    Session = sessionmaker(bind=create_sql_engine())
    session = Session()

    try:
        session.add(user_interest)
        session.commit()
        logger.info(f"Added {user_interest} to acmesky_db")
    except Exception:
        logger.warn(f"Database error while inserting {user_interest} from {user_interest_dict}")
        return task.bpmn_error(error_code='interest_saving_failed',
                               error_message='Error inserting rows in the database')

    return task.complete({"operation_result": "OK"})
