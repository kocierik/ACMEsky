from datetime import datetime, date

from camundaworkers.model.flight import Flight


def departure_match_offer_interest(offer: Flight, interest) -> bool:
    """
    Checks if the offers match the departure part of the interest.
    :param offer: a flight offer
    :param interest: an user interest
    :return: true if the offer match the departure part of the interest
    """
    # All'andata:

    # Se i due codici dell'aeroporto di partenza non coincidono non c'è un match
    if offer.departure_airport_code != interest.get("departure_airport_code"):
        return False

    # Se i due codici dell'aeroporto di arrivo non coincidono non c'è un match
    if offer.arrival_airport_code != interest.get("arrival_airport_code"):
        return False

    # Se la data minima nella quale l'utente vuole partire è minore della data di partenza del volo allora non c'è match
    if date.fromisoformat(interest.get("min_departure_date")) > offer.departure_datetime.date():
        return False

    return True


def comeback_match_offer_interest(offer: Flight, interest) -> bool:
    """
    Checks if the offers match the comeback part of the interest.
    :param offer: a flight offer
    :param interest: an user interest
    :return: true if the offer match the comeback part of the interest
    """
    # Al ritorno, considerando lo stessa interesse inserito dall'utente

    # Se il codice di partenza dell'interessa è diverso dal codice di arrivo allora non c'è un match
    if offer.departure_airport_code != interest.get("arrival_airport_code"):
        return False

    # Se il codice di arrivo dell'interessa è diverso dal codice di partenza allora non c'è un match
    if offer.arrival_airport_code != interest.get("departure_airport_code"):
        return False

    # Se la data massima nella quale l'utente può tornare è minore della data del volo allora non c'è match

    if date.fromisoformat(interest.get("max_comeback_date")) < offer.arrival_datetime.date():
        return False

    return True

def find_min_cost_flights_couple(outbound_flights: list, comeback_flights: list):
    """
    Returns the first couple of outbound and comeback flights that allows the user to travel.
    :param outbound_flights: list of outbound flights
    :param comeback_flights: list of comeback flights
    :return: Flight, Flight if a couple is found; None, None otherwise
    """
    ordered_outbound_flights = sorted(outbound_flights, key=lambda flight: float(flight.cost))
    ordered_comeback_flights = sorted(comeback_flights, key=lambda flight: float(flight.cost))
    for outbound_flight in ordered_outbound_flights:
        for comeback_flight in ordered_comeback_flights:
            if outbound_flight.arrival_datetime < comeback_flight.departure_datetime \
            and outbound_flight.flight_company_name == comeback_flight.flight_company_name:
                return outbound_flight, comeback_flight
    return None, None