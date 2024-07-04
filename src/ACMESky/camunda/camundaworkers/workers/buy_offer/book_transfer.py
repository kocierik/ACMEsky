import json

from camunda.external_task.external_task import ExternalTask, TaskResult
from sqlalchemy.orm import sessionmaker

from zeep import Client
from zeep.exceptions import Fault

from camundaworkers.utils.logger import get_logger
from camundaworkers.utils.db import create_sql_engine
from camundaworkers.model.offer_purchase_data import OfferPurchaseData
from camundaworkers.model.payment_info import PaymentInfo
from camundaworkers.model.flight import Flight


def book_transfer(task: ExternalTask) -> TaskResult:
    """
    Contacts the chosen Travel Company and requests to book a travel using the SOAP protocol
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("book_transfer")

    distances = json.loads(str(task.get_variable("distances")))
    distances = distances.get("distances")
    
    offer_purchase_data = OfferPurchaseData.from_dict(json.loads(task.get_variable("offer_purchase_data")))
    payment_info = PaymentInfo.from_dict(json.loads(task.get_variable("payment_status")))
    flights = [Flight.from_dict(flight) for flight in payment_info.flights]

    # Connects to PostgreSQL to get the offer match information
    Session = sessionmaker(bind=create_sql_engine())
    session = Session()

    # Identifies the Travel Company to contact, choosing the one nearer to the user's address.
    travel_company_to_contact = min(distances, key=lambda tc: tc.get("distance"))

    # Creates the SOAP Client and the datetime when then transfer will be booked for.
    # We need to replace the port for accessing the web server serving the WSDL interface.
    wsdl_url = travel_company_to_contact.get("company").replace(":8030", ":8000") + '/' + travel_company_to_contact.get("wsdl")
    soap_client = Client(wsdl=wsdl_url)

    outbound_departure_transfer_datetime = flights[0].departure_date
    comeback_arrival_transfer_datetime = flights[1].arrival_date

    try:
        soap_response = soap_client.service.buyTransfers(
            customer_address=str(offer_purchase_data.address),
            airport_code=flights[0].departure_location,
            customer_name=f"{offer_purchase_data.user_id}",
            departure_transfer_datetime=outbound_departure_transfer_datetime,
            arrival_transfer_datetime=comeback_arrival_transfer_datetime,
            rent_service=travel_company_to_contact.get('wsdl').replace(".wsdl", ""))
        
        tickets = json.loads(str(task.get_variable("tickets")))
        tickets["rent"] = soap_response
        
        return task.complete(global_variables={"tickets": json.dumps(tickets)})
    except Fault:
        return task.failure("Book ticket", "Failure in booking ticket from travel company",
                            max_retries=5,
                            retry_timeout=10)
