from camunda.external_task.external_task import ExternalTask, TaskResult
from pymongo import MongoClient

from camundaworkers.utils.logger import get_logger
from os import environ


def retrieve_user_interests(task: ExternalTask) -> TaskResult:
    """
    Retrieves the interests related to a user from MongoDB
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("retrieve_user_interests")

    # Connects to MongoDB
    username = environ.get("MONGO_USER", "root")
    password = environ.get("MONGO_PASSWORD", "password")
    client = MongoClient(f"mongodb://{username}:{password}@acmesky_mongo:27017")
    acmesky_db = client['ACMESky']
    interests_collection = acmesky_db['interests']

    # Pipeline to perform the research and generate a clear dictionary with the data retrieved.
    pipeline = [
        {
            "$group": {
                "_id": "$prontogram_username",
                "interests": {
                    "$addToSet": {
                        "interest_id": "$_id",
                        "departure_airport_code": "$departure_airport_code",
                        "arrival_airport_code": "$arrival_airport_code",
                        "min_departure_date": "$min_departure_date",
                        "max_comeback_date": "$max_comeback_date",
                        "max_price": "$max_price",
                        "offer_codes": "$offer_codes"
                    }
                }
            }
        }
    ]

    users = list(interests_collection.aggregate(pipeline))

    for u in users:
        for i in u.get('interests'):
            # Workaround for easier deserialization, since Camunda returns encoded and marshalled Java objects.
            i['max_price'] = str(i['max_price'])
            i['interest_id'] = str(i['interest_id'])

    logger.info(f"There are {len(users)} users to be checked")
    return task.complete(global_variables={"users": users})
