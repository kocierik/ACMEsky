from camundaworkers.workers.daily_flight_check.get_flight_offers import get_flight_offers

TASKS = [
    ("get-flight-offers", get_flight_offers),
]
