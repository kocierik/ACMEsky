type PostOfferRequest: void {
    .sender: AuthenticatedUser
    .receiver_user_id: string
    .content: string
}

type Offer: void {
    .content: string
    .data: string
}

type OfferList: void {
    .offers[0,*]: Offer
}

interface IProntogramService
{

    RequestResponse:
        addOffer(PostOfferRequest)(Offer) throws UserNotFound(string) UserNotAuthorized(string),
        getOffers()(OfferList) throws UserNotAuthorized(string)
}
