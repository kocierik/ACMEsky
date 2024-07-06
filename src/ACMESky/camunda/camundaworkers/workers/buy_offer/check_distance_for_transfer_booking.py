from camunda.external_task.external_task import ExternalTask, TaskResult

from camundaworkers.utils.logger import get_logger
import json


def check_distance_for_transfer_booking(task: ExternalTask) -> TaskResult:
    """
    Checks if the user can have access to the transfer bundle.
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("check_distance_for_transfer_booking")

    distance: str = task.get_variable("distance")

    try:
        distance = float(distance)
    except ValueError:
        logger.exception(f"Invalid distance value: {distance}")
        return task.complete(global_variables={"book_travel_company": False})

    if distance <= 30:
        return task.complete(global_variables={"book_travel_company": True, "distances": json.dumps({"distances": []})})
    else:
        return task.complete(global_variables={"book_travel_company": False})

