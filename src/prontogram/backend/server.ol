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
                statusCodes.UserNotAuthorized = 401
            }
            addOffer << {
                template = "/api/offer"
                method = "post"
                statusCodes.UserNotAuthorized = 401
                statusCodes.UserNotFound = 404
            }
        }
    }
    
}

execution { concurrent }

init {
    global.users = {}
    global.inbox = {}
}

cset {
    sid: AuthenticatedUser.sid
}

main {

    [
        addOffer(SendOfferRequest)(Offer){
            with(Offer) {
                .id = new;
                .content = SendOfferRequest.content;
                .sender_user_id = SendOfferRequest.sender.user_id;
                .receiver_user_id = SendOfferRequest.receiver_user_id
            }
            if ( !is_defined( global.users.(Offer.receiver_user_id) ) ) {
                throw (UserNotFound, Offer.receiver_user_id)
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
        getOffers(AuthenticatedUser)(OfferList){
            inbox -> global.inbox.(AuthenticatedUser.user_id)
            synchronized(inboxLock) {
                for( i = 0, i < #inbox, i++ ) {
                    if( is_defined(inbox[i])) {
                        OfferList.offers[#OfferList.offers] << inbox[i]
                    }
                }
                
                // undef(global.inbox.(AuthenticatedUser.user_id))
            }

            valueToPrettyString@StringUtils(OfferList)( s )
            println@Console("Offers " + s)()

            valueToPrettyString@StringUtils(inbox)( s )
            println@Console("Offers left " + s)()
        }
    ]
}
