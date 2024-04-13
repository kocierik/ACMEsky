from camunda.external_task.external_task import ExternalTask, TaskResult
import json
from pymongo import MongoClient

from camundaworkers.logger import get_logger
from os import environ


def register_interest(task: ExternalTask) -> TaskResult:
    """
    Saves the interest in MongoDB.
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("register_interest")

    interest = json.loads(task.get_variable("interest"))
    # The user pushes the interest without the field "offer_codes" (which is necessary for later updates).
    interest["offer_codes"] = []

    """ Connection and save on MongoDB
    """
    username = environ.get("MONGO_USER", "root")
    password = environ.get("MONGO_PASSWORD", "password")
    client = MongoClient(f"mongodb://{username}:{password}@acmesky_mongo:27017")  # Connects to MongoDB
    acmesky_db = client['ACMESky']  # Selects the right DB
    interests_collection = acmesky_db['interests']  # Selects the right document

    # Inserting into the DB only if it does not already exist.
    if not interests_collection.find_one(interest):
        interests_collection.insert_one(interest)

    return task.complete({"operation_result": "OK"})
