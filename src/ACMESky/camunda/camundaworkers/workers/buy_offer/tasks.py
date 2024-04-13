from camundaworkers.workers.buy_offer.payment_request import payment_request
from camundaworkers.workers.buy_offer.rehabilitation_offer_code import rehabilitation_offer_code
from camundaworkers.workers.buy_offer.send_correct_offer_code import send_correct_offer_code
from camundaworkers.workers.buy_offer.send_timeout_request_payment import send_timeout_request_payment
from camundaworkers.workers.buy_offer.send_wrong_offer_code import send_wrong_offer_code
from camundaworkers.workers.buy_offer.send_wrong_payment_status import send_wrong_payment_status
from camundaworkers.workers.buy_offer.verify_offer_code_validity import verify_offer_code_validity
from camundaworkers.workers.buy_offer.verify_payment_status import verify_payment_status
from camundaworkers.workers.buy_offer.buy_flights import buy_flights
from camundaworkers.workers.buy_offer.verify_condition_for_travel_booking import verify_condition_for_travel_booking
from camundaworkers.workers.buy_offer.send_tickets import send_tickets
from camundaworkers.workers.buy_offer.check_distance_house_airport import check_distance_house_airport
from camundaworkers.workers.buy_offer.check_distance_for_transfer_booking import check_distance_for_transfer_booking
from camundaworkers.workers.buy_offer.get_min_distance_house_travel_distance import get_min_distance_house_travel_distance
from camundaworkers.workers.buy_offer.book_transfer import book_transfer

TASKS = [
    ("verify-offer-code-validity", verify_offer_code_validity),
    ("rehabilitation-offer-code", rehabilitation_offer_code),
    ("send-correct-offer-code", send_correct_offer_code),
    ("send-wrong-offer-code", send_wrong_offer_code),
    ("payment-request", payment_request),
    ("send-timeout-request-payment", send_timeout_request_payment),
    ("verify-payment-status", verify_payment_status),
    ("send-wrong-payment-status", send_wrong_payment_status),
    ("buy-flights", buy_flights),
    ("verify-condition-for-travel-booking", verify_condition_for_travel_booking),
    ("send-tickets", send_tickets),
    ("check-distance-house-airport", check_distance_house_airport),
    ("check-distance-for-transfer-booking", check_distance_for_transfer_booking),
    ("get-min-distance-house-travel-distance", get_min_distance_house_travel_distance),
    ("book-transfer", book_transfer)
]
