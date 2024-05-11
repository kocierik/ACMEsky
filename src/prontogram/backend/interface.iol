type AddOfferRequest: void {
    .receiver_user_id: string
    .code: string
    .content: string
}

type Offer: void {
    .code: string
    .content: string
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
        addOffer(AddOfferRequest)(Offer)
        getOffers(UserId)(OfferList)
}
