from camundaworkers.workers.register_user_interest.send_result import send_result
from camundaworkers.workers.register_user_interest.register_interest import register_interest

TASKS = [
    ("register-interest", register_interest),
    ("send-result", send_result)
]
