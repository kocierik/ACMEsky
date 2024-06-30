from enum import Enum

class EventSSEType(Enum):
    ERROR = 'errors'
    FLIGHTS_INFOS = 'flights_infos'
    PAYMENT_URL = 'payment_url'
    TICKETS = 'tickets'