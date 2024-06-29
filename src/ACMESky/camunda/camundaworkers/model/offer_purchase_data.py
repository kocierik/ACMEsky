
class OfferPurchaseData:
    def __init__(self, offer_code: str, address: str, user_id: str):
        self.offer_code = offer_code
        self.address = address
        self.user_id = user_id

    @staticmethod
    def from_dict(data: dict):
        """
        Create an OfferPurchaseData object starting from a dictionary
        :param data: dictionary which contains the data to create the OfferPurchaseData object
        :return: an OfferPurchaseData object
        """
        return OfferPurchaseData(
            offer_code=data.get("offerCode"),
            address=data.get("address"),
            user_id=data.get("userId"),
        )

    def to_dict(self):
        """
        Convert teh object into a dictionary
        :return: a dictionary which contains the object's data
        """
        return {
            "offer_code":self.offer_code,
            "address" : self.address.to_dict(),
            "user_id" : self.user_id
        }