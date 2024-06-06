from camunda.external_task.external_task import ExternalTask, TaskResult
from sqlalchemy.orm import sessionmaker
from camundaworkers.model.user_interest import UserInterest
from camundaworkers.utils.db import create_sql_engine
from camundaworkers.utils.logger import get_logger

def retrieve_user_interests(task: ExternalTask) -> TaskResult:
    """
    Retrieves the interests from PostgreSQL
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("retrieve_user_interests")

    # Connection and save on PostgreSQL
    Session = sessionmaker(bind=create_sql_engine())
    session = Session()

    try:
        # Retrieves the users interests grouped by user id
        users_interests = session.query(UserInterest).group_by(UserInterest.user_id).all()
    except Exception:
        return task.bpmn_error(error_code='',
                               error_message='Error retrieving users interests from the database')

    logger.info("There are %s users interest to be checked", len(users_interests))
    logger.info("users_interests: %s", users_interests)
    return task.complete(global_variables={"users_interests": users_interests})
