from camundaworkers.workers.daily_flight_check.get_flight_offers import get_flight_offers
from camundaworkers.workers.daily_flight_check.save_offers import save_offers

TASKS = [
    ("get-flight-offers", get_flight_offers),
    ("save-offers", save_offers),
]
