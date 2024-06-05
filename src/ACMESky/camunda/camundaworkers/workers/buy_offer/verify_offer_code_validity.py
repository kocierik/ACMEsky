import datetime

from camundaworkers.model.offer_purchase_data import OfferPurchaseData
from camundaworkers.model.offer import OfferMatch
from camunda.external_task.external_task import ExternalTask, TaskResult
from sqlalchemy.orm.session import sessionmaker
from camundaworkers.utils.logger import get_logger
from camundaworkers.utils.db import create_sql_engine

import json


def verify_offer_code_validity(task: ExternalTask) -> TaskResult:
    """
    Verifies that the offer code is valid, not expired and not already in use by another user.
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("verify_offer_code_validity")

    offer_purchase_data = OfferPurchaseData.from_dict(json.loads(task.get_variable("offer_purchase_data")))

    offer_code = offer_purchase_data.offer_code

    # Connects to PostgreSQL
    Session = sessionmaker(bind=create_sql_engine())
    session = Session()

    user_communication_code = str(hash(offer_purchase_data))

    # Checks if the offer matched is blocked
    matches = session.query(OfferMatch).filter(OfferMatch.offer_code == offer_code,
                                               OfferMatch.blocked == True).all()
    if len(matches) == 1:
        logger.error(f"Offer code is BLOCKED.")
        return task.complete(global_variables={'offer_code_validity': False, 'user_communication_code': user_communication_code})

    # Checks if the offer match is not expired and sets it to blocked=True.
    affected_rows = session.query(OfferMatch).filter(OfferMatch.offer_code == offer_code,
                                                     OfferMatch.creation_date >= datetime.datetime.now(tz=datetime.timezone.utc) - datetime.timedelta(hours=24)).update({"blocked": True}, synchronize_session="fetch")
    if affected_rows < 1:
        session.rollback()
        logger.error(f"{affected_rows} matches were found for the given offer code.")
        return task.complete(global_variables={'offer_code_validity': False, 'user_communication_code': user_communication_code})

    logger.info(f"{affected_rows} match was found for the given offer code.")
    session.commit()
    return task.complete(global_variables={'offer_code_validity': True, 'user_communication_code': user_communication_code})