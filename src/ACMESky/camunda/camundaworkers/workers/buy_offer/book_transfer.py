import json

from camunda.external_task.external_task import ExternalTask, TaskResult
from sqlalchemy.orm import sessionmaker

from camundaworkers.utils.logger import get_logger
from zeep import Client
from zeep.exceptions import Fault

from camundaworkers.utils.db import create_sql_engine
from camundaworkers.model.flight import OfferMatch
from camundaworkers.model.offer_purchase_data import OfferPurchaseData
from datetime import timedelta


def book_transfer(task: ExternalTask) -> TaskResult:
    """
    Contacts the chosen Travel Company and requests to book a travel using the SOAP protocol
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("get_min_distance_house_travel_distance")

    distances = json.loads(str(task.get_variable("distances")))
    distances = distances.get("distances")
    offer_purchase_data = OfferPurchaseData.from_dict(json.loads(task.get_variable("offer_purchase_data")))
    tickets = json.loads(str(task.get_variable("tickets")))

    # Connects to PostgreSQL to get the offer match information
    Session = sessionmaker(bind=create_sql_engine())
    session = Session()
    offer_match: OfferMatch = session.query(OfferMatch).get({"offer_code": offer_purchase_data.offer_code})

    # Identifies the Travel Company to contact, choosing the one nearer to the user's address.
    travel_company_to_contact = min(distances, key=lambda tc: tc.get("distance"))

    # Creates the SOAP Client and the datetime when then transfer will be booked for.
    # We need to replace the port for accessing the web server serving the WSDL interface.
    wsdl_url = travel_company_to_contact.get("company").replace(":8080", ":8000") + "/travel_company.wsdl"
    soap_client = Client(wsdl=wsdl_url)

    outbound_departure_transfer_datetime = offer_match.outbound_flight.departure_datetime - timedelta(hours=4)
    comeback_arrival_transfer_datetime = offer_match.comeback_flight.arrival_datetime + timedelta(minutes=10)

    try:
        soap_response = soap_client.service.buyTransfers(
            departure_transfer_datetime=outbound_departure_transfer_datetime.strftime("%Y-%m-%dT%H:%M:%S"),
            customer_address=str(offer_purchase_data.address),
            airport_code=offer_match.outbound_flight.departure_airport_code,
            customer_name=f"{offer_purchase_data.name} {offer_purchase_data.surname}",
            arrival_transfer_datetime=comeback_arrival_transfer_datetime.strftime("%Y-%m-%dT%H:%M:%S"))
        tickets["transfers"] = [soap_response]
        return task.complete(global_variables={"tickets": json.dumps(tickets)})
    except Fault:
        return task.failure("Book ticket", "Failure in booking ticket from travel company",
                            max_retries=5,
                            retry_timeout=10)
