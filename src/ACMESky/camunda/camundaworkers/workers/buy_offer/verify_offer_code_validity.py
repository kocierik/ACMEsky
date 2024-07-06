import datetime
import json
from sqlalchemy.orm.session import sessionmaker
from camunda.external_task.external_task import ExternalTask, TaskResult
from camundaworkers.utils.logger import get_logger
from camundaworkers.utils.db import create_sql_engine
from camundaworkers.model.offer_purchase_data import OfferPurchaseData
from camundaworkers.model.user_interest import UserInterest
from camundaworkers.model.offer import Offer


def verify_offer_code_validity(task: ExternalTask) -> TaskResult:
    """
    Verifies that the offer code is valid, not expired and not already in use by another user.
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("verify_offer_code_validity")

    offer_purchase_data = OfferPurchaseData.from_dict(json.loads(task.get_variable("offer_purchase_data")))

    # Creating a session for PostgreSQL
    Session = sessionmaker(bind=create_sql_engine())
    session = Session()

    # Checks if the offer is valid and not expired
    one_day_ago = datetime.datetime.now(tz=datetime.timezone.utc) - datetime.timedelta(hours=24)
    offers_lenght = session.query(Offer) \
        .filter(Offer.user_id == offer_purchase_data.user_id, Offer.activation_code == offer_purchase_data.offer_code, Offer.created_at >= one_day_ago, Offer.payed == False) \
        .count()

    if offers_lenght < 1:
        session.rollback()
        logger.error("0 matches were found for the given offer code %s", offer_purchase_data.offer_code)
        return task.complete(global_variables={'offer_code_validity': False})

    # Set the user_interest to valid = False
    interest_id = session.query(Offer.interest_id).filter(Offer.activation_code == offer_purchase_data.offer_code).first()[0]
    session.query(UserInterest).filter(UserInterest.id == interest_id).update({UserInterest.valid: False})

    session.commit()
    return task.complete(global_variables={'offer_code_validity': True})