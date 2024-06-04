#!/usr/bin/env python3

from concurrent.futures.thread import ThreadPoolExecutor

from camunda.external_task.external_task_worker import ExternalTaskWorker

from camundaworkers.workers.register_user_interest.tasks import TASKS as register_user_interest_TASKS
from camundaworkers.workers.last_minute_notifications.tasks import TASKS as last_minute_notifications_TASKS
# from camundaworkers.workers.daily_flight_check.tasks import TASKS as daily_fligh_check_TASKS
# from camundaworkers.workers.buy_offer.tasks import TASKS as buy_offer_TASKS

from camundaworkers.utils.logger import get_logger

# configuration for the Client
default_config = {
    "maxTasks": 1,
    "lockDuration": 10000,
    "asyncResponseTimeout": 5000,
    "retries": 3,
    "retryTimeout": 5000,
    "sleepSeconds": 30
}


def main():
    logger = get_logger()
    logger.info("Workers started")
    BASE_URL = "http://camunda:8080/engine-rest"

    """ Topics associated to the tasks
    """
    TOPICS = register_user_interest_TASKS + last_minute_notifications_TASKS # + daily_fligh_check_TASKS + buy_offer_TASKS

    """
    Creation and execution of different threads, one per worker/topic
    """
    executor = ThreadPoolExecutor(max_workers=len(TOPICS), thread_name_prefix="ACMESky-Backend")
    for index, topic_handler in enumerate(TOPICS):
        topic = topic_handler[0]
        handler_func = topic_handler[1]
        executor.submit(ExternalTaskWorker(worker_id=index, base_url=BASE_URL, config=default_config).subscribe, topic,
                        handler_func)


if __name__ == '__main__':
    main()
