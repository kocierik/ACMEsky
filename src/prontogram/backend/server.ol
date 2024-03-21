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
            auth_signup << {
                template = "/api/auth/signup"
                method = "post"
                statusCodes.UserAlreadyExists = 403
            }
            auth_login << {
                template = "/api/auth/login"
                method = "post"
                statusCodes.UserNotAuthorized = 401
                statusCodes.UserNotFound = 404
            }
            auth_logout << {
                template = "/api/auth/logout"
                method = "post"
                statusCodes.UserNotAuthorized = 401
                statusCodes.UserNotFound = 404
            }
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
        auth_signup(UserSignUpRequest)() {
            if ( is_defined( global.users.(UserSignUpRequest.credentials.user_id) ) ) {
                throw (UserAlreadyExists, UserSignUpRequest.credentials.user_id)
            }
            
            with(global.users.(UserSignUpRequest.credentials.user_id)) {
                .id = UserSignUpRequest.credentials.user_id;
                .display_name = UserSignUpRequest.display_name;
                .password = UserSignUpRequest.credentials.password
            }

            println@Console("New user signed up: '" + global.users.(UserSignUpRequest.credentials.user_id).id + "'")()
        }
    ]
    [
        auth_login(UserAuthCredentials)(AuthenticatedUser) {
            if ( !is_defined( global.users.(UserAuthCredentials.user_id) ) ) {
                throw (UserNotFound, UserAuthCredentials.user_id)
            }
            else if( global.users.(UserAuthCredentials.user_id).password != UserAuthCredentials.password ) {
                throw (UserNotAuthorized, UserAuthCredentials.user_id)
            }
            else {
                csets.sid = new
                with(AuthenticatedUser) {
                    .user_id = UserAuthCredentials.user_id;
                    .sid = csets.sid
                }
                isLogged = true
                println@Console("user '" + AuthenticatedUser.user_id + "' logged in")()
                println@Console("user '" + AuthenticatedUser.user_id + " started session " + AuthenticatedUser.sid )()
            }
        }
    ]
    [
        auth_logout(AuthenticatedUser)() {
            if ( !is_defined( global.users.(AuthenticatedUser.user_id) ) ) {
                throw (UserNotFound, UserAuthCredentials.user_id)
            }
            else {
                isLogged = false
            }
            println@Console("user '" + AuthenticatedUser.user_id + "' logged out")()
        }
    ]
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
