include "console.iol"
include "string_utils.iol"
include "interface.iol"

inputPort ProntogramServicePort
{
    Location: "socket://localhost:8050"
    Interfaces: IProntogramService
    Protocol: http {
        format -> httpResponse.format
        statusCode -> httpResponse.statusCode
        response.headers.("Access-Control-Allow-Origin") = "*"
        response.headers.("Access-Control-Allow-Headers") = "*"
        response.headers.("Access-Control-Allow-Credentials") = "true"
        response.headers.("Access-Control-Allow-Methods") = "*"
        osc << {
            getOffers << {
                template = "/api/offers"
                method = "get"
                format = "json"
                statusCodes = 200
                statusCodes.TypeMismatch = 400
            }
            addOffer << {
                template = "/api/offer"
                method = "post"
                format = "json"
                statusCodes = 200
                statusCodes.TypeMismatch = 400
            }
            deleteOffer << {
                template = "/api/offer"
                method = "delete"
                format = "json"
                statusCodes = 200
                statusCodes.TypeMismatch = 400
            }
        }
    }
    
}

execution { concurrent }

init {
    global.inbox = {}
}

main {

    [
        addOffer(AddOfferRequest)(Offer){
            with(Offer) {
                .activation_code = AddOfferRequest.activation_code;
                .user_id = AddOfferRequest.user_id;
                .message = AddOfferRequest.message;
                .valid = true
            }
            inbox -> global.inbox.(Offer.user_id)
            synchronized(inboxLock) {
                idx = #inbox
                inbox[idx] << Offer
            }

            println@Console("Offer added")()
            valueToPrettyString@StringUtils(Offer)( s )
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

            println@Console("Offers retrieved")()
            valueToPrettyString@StringUtils(OfferList)( s )
        }
    ]
    [
        deleteOffer(DeleteOfferRequest)(void){
            inbox -> global.inbox.(DeleteOfferRequest.user_id)
            synchronized(inboxLock) {
                for( i = 0, i < #inbox, i++ ) {
                    if( inbox[i].activation_code == DeleteOfferRequest.activation_code) {
                        inbox[i].valid = false
                    }
                }
            }
            println@Console("Offer deleted")()
            valueToPrettyString@StringUtils(DeleteOfferRequest)( s )
        }
    ]
}
