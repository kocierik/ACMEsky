include "console.iol"
include "string_utils.iol"
include "interface.iol"

inputPort ProntogramServicePort
{
    Location: "socket://localhost:8000"
    Interfaces: IProntogramService
    Protocol: http {
        format = "json"
        // contentType = "application/json"
        osc << {
            getOffers << {
                template = "/api/offers"
                method = "get"
            }
            addOffer << {
                template = "/api/offer"
                method = "post"
            }   
        }
    }
    
}

execution { concurrent }

init {
    global.users = {}
    global.inbox = {}
}

main {

    [
        addOffer(AddOfferRequest)(Offer){
            with(Offer) {
                .id = new;
                .content = AddOfferRequest.content;
                .code = AddOfferRequest.code;
                .receiver_user_id = AddOfferRequest.receiver_user_id
            }
            inbox -> global.inbox.(Offer.receiver_user_id)
            synchronized(inboxLock) {
                idx = #inbox
                inbox[idx] << Offer
            }

            valueToPrettyString@StringUtils(Offer)( s )
            println@Console("Offer " + s)()
        }
    ]
    [
        getOffers(UserId)(OfferList){
            inbox -> global.inbox.(UserId.id)
            synchronized(inboxLock) {
                for( i = 0, i < #inbox, i++ ) {
                    if( is_defined(inbox[i])) {
                        OfferList.offers[#OfferList.offers] << inbox[i]
                    }
                }
            }

            valueToPrettyString@StringUtils(OfferList)( s )
            println@Console("Offers " + s)()

            valueToPrettyString@StringUtils(inbox)( s )
            println@Console("Offers left " + s)()
        }
    ]
}
