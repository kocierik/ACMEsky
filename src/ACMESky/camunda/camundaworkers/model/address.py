class Address:
    def __init__(self, street: str, number: str, city: str, zip_code: str, country: str):
        self.street = street
        self.number = number
        self.city = city
        self.zip_code = zip_code
        self.country = country

    @staticmethod
    def from_dict(data: dict):
        """
        Build an Address from a dictionary, useful when the Address is in string in JSON format
        :param data: a dictionary which contains the data to build an Address
        :return: a new Address object
        """
        return Address(
            street=data.get('street'),
            number=data.get('number'),
            city=data.get('city'),
            zip_code=data.get('zip_code'),
            country=data.get('country')
        )

    def __key(self):
        return self.street, self.number, self.city, self.zip_code, self.country

    def __hash__(self):
        return hash(self.__key())

    def __eq__(self, other):
        if isinstance(other, Address):
            return self.__key() == other.__key()
        return NotImplemented

    def to_dict(self):
        """
        Convert the data saved in the object into a dictionary, useful to convert it into a string in JSON format
        :return: a dictionary containing the address information
        """
        return {
            "street": self.street,
            "number": self.number,
            "city": self.city,
            "zip_code": self.zip_code,
            "country": self.country
        }

    def __str__(self):
        return f"{self.street} {self.number}, {self.city}, {self.zip_code}, {self.country}"
