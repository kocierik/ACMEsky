from camunda.external_task.external_task import ExternalTask, TaskResult
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import joinedload
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

    users_interests = {}
    try:
        users_interests_list: list[UserInterest] = session.query(UserInterest).all()

        # Store all the interests in a dictionary with the user_id as key and the list of interests as value
        for user_interest in users_interests_list:
            user_id = user_interest.user_id
            if user_id in users_interests:
                users_interests[user_id].append(user_interest.to_dict())
            else:
                users_interests[user_id] = [user_interest.to_dict()]
    except Exception as e:
        logger.error("Database error while retrieving users interests. Error: %s", e)
        return task.bpmn_error(error_code='',
                               error_message='Error retrieving users interests from the database')

    logger.info("There are %s users interest to be checked", len(users_interests))
    logger.info("users_interests: %s", users_interests)
    return task.complete(global_variables={"users_interests": users_interests})
