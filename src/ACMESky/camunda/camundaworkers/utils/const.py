from enum import Enum

class EventSSEType(Enum):
    ERROR = 'error'
    FLIGHT_INFOS = 'flight_infos'
    PAYMENT_URL = 'payment_url'
    TICKETS = 'tickets'