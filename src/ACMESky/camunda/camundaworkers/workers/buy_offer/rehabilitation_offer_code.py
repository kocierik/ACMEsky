import json

from camunda.external_task.external_task import ExternalTask, TaskResult
from sqlalchemy.orm.session import sessionmaker
from camundaworkers.utils.logger import get_logger
from camundaworkers.utils.db import create_sql_engine
from camundaworkers.model.flight import OfferMatch
from camundaworkers.model.offer_purchase_data import OfferPurchaseData


def rehabilitation_offer_code(task: ExternalTask) -> TaskResult:
    """
    Compensation task: if the verification offer code and payment sub process fail, this task rehabilitates the offer
    code for another try.
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("rehabilitation_offer_code")

    offer_purchase_data = OfferPurchaseData.from_dict(json.loads(task.get_variable("offer_purchase_data")))

    offer_code = offer_purchase_data.offer_code

    # Connects to postgreSQL
    Session = sessionmaker(bind=create_sql_engine())
    session = Session()

    """
    Gets the offer match that has to be rehabilitated from the DB.
    The offer match is the one blocked and with offer_code equal to the process offer_code variable.
    """
    affected_rows = session.query(OfferMatch).filter(OfferMatch.offer_code == offer_code).update({"blocked": False},
                                                                                                 synchronize_session="fetch")
    if affected_rows < 1:
        session.rollback()
        logger.error(
            f"{affected_rows} matches were found for the given offer code. The offer code will not be rehabilitated.")
        return task.complete()

    logger.info(f"{affected_rows} match was found for the given offer code.")
    session.commit()
    return task.complete()
