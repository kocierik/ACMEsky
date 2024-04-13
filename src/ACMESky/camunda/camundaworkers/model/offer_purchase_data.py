from camundaworkers.model.address import Address


class OfferPurchaseData:
    def __init__(self, offer_code: str, name: str, surname: str, address: Address):
        self.offer_code = offer_code
        self.name = name
        self.surname = surname
        self.address = address

    @staticmethod
    def from_dict(data: dict):
        """
        Create a new OfferPurchaseData from a dictionary, useful when the purchase data are in a string in JSON format
        :param data: dictionary which contains the data to create the OfferPurchaseData object
        :return: an OfferPurchaseData object
        """
        return OfferPurchaseData(
            offer_code=data.get("offer_code"),
            name=data.get("name"),
            surname=data.get("surname"),
            address=Address.from_dict(data.get("address")),
        )

    def to_dict(self):
        """
        Convert teh object into a dictionary
        :return: a dictionary which contains the object's data
        """
        return {
            "offer_code":self.offer_code,
            "name" : self.name,
            "surname" : self.surname,
            "address" : self.address.to_dict(),
        }

    def __key(self):
        return self.offer_code, self.name, self.surname, self.address

    def __hash__(self):
        """
        Custom hash function to generate a reproducible hash
        :return: an hash string
        """
        return hash((self.offer_code,
                     self.name,
                     self.surname,
                     hash((
                         self.address.street,
                         self.address.number,
                         self.address.city,
                         self.address.zip_code,
                         self.address.country))
                     ))

    def __eq__(self, other):
        if isinstance(other, OfferPurchaseData):
            return self.__key() == other.__key()
        return NotImplemented
