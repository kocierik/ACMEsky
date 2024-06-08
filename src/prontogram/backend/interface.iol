type AddOfferRequest: void {
    .user_id: string
    .activation_code: string
    .message: string
}

type Offer: void {
    .user_id: string
    .activation_code: string
    .message: string
}

type OfferList: void {
    .offers[0,*]: Offer
}

type UserId: void {
    .id: string
}

interface IProntogramService
{

    RequestResponse:
        addOffer(AddOfferRequest)(Offer),
        getOffers(UserId)(OfferList)
}
