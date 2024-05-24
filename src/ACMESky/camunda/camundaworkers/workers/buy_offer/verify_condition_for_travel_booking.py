from camunda.external_task.external_task import ExternalTask, TaskResult

from camundaworkers.utils.logger import get_logger


def verify_condition_for_travel_booking(task: ExternalTask) -> TaskResult:
    """
    Verifies the price condition for the transfer bundle.
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("verify_condition_for_travel_booking")

    total_amount = float(task.get_variable("total_amount"))

    if total_amount >= 1000:
        return task.complete(global_variables={"can_book_travel_company": True})
    else:
        return task.complete(global_variables={"can_book_travel_company": False})
