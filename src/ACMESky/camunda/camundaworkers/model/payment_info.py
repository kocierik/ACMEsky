class PaymentInfo:
    def __init__(self, amount: int, payment_receiver: str, offer_code: str, description: str, user_id: str, flights: list, process_instance_id: str, payment_code: str = None, payed: bool = False):
        self.amount = amount
        self.payment_receiver = payment_receiver
        self.offer_code = offer_code
        self.description = description
        self.user_id = user_id
        self.flights = flights
        self.process_instance_id = process_instance_id
        self.payment_code = payment_code
        self.payed = payed


    @staticmethod
    def from_dict(data: dict):
        """
        Create an PaymentInfo object starting from a dictionary
        :param data: dictionary which contains the data to create the PaymentInfo object
        :return: an PaymentInfo object
        """
        return PaymentInfo(
            amount=data.get("amount"),
            payment_receiver=data.get("payment_receiver"),
            offer_code=data.get("offer_code"),
            description=data.get("description"),
            user_id=data.get("user_id"),
            flights=data.get("flights"),
            process_instance_id=data.get("process_instance_id"),
            payment_code=data.get("payment_code"),
            payed=data.get("payed")
        )

    def to_dict(self):
        """
        Convert the object into a dictionary
        :return: a dictionary which contains the object's data
        """
        return {
            "amount":self.amount,
            "payment_receiver":self.payment_receiver,
            "offer_code":self.offer_code,
            "description":self.description,
            "user_id":self.user_id,
            "flights":self.flights,
            "process_instance_id":self.process_instance_id,
            "payment_code":self.payment_code,
            "payed":self.payed,
        }
