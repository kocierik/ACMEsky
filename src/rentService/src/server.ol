include "rent.iol"
include "console.iol"
include "time.iol"
include "string_utils.iol"

execution{ concurrent }

inputPort RentService {
	Location:"socket://localhost:8030"
	Protocol: soap {
		.wsdl = "./rentService.wsdl";
		.wsdl.port = "Rent";
		.dropRootValue = true;
	}
	Interfaces: RentServiceInterface
}

init {
	println@Console("Travel company service started")();
	install (Fault400 => throw(Fault400, {description = main.Fault400.description}))
}

main {
	buyTransfers( request )( response ) {
		/*
		* In the following scope the field request.departure_transfer_datetime is checked for correctness.
		* A Fault400 error is thrown if the date is invalid.
		*/
		scope (dateFormatCheckingDepartureDateTime) {
			install ( InvalidTimestamp => {
				println@Console("Invalid date format in departure_transfer_datetime")();
				throw (Fault400, {description = "Invalid date format in departure_transfer_datetime"})
			})

			dateTime = request.departure_transfer_datetime;
			dateTime.format = "yyyy-MM-dd'T'HH:mm:ss";
			getTimestampFromString@Time(dateTime)(departureTransferTimestamp)
		}
		
		/*
		* In the following scope the field request.arrival_transfer_datetime is checked for correctness.
		* A Fault400 error is thrown if the date is invalid.
		*/
		scope (dateFormatCheckingArrivalDateTime) {
			install ( InvalidTimestamp => {
				println@Console("Invalid date format in arrival_transfer_datetime")()
				throw (Fault400, {description = "Invalid date format in arrival_transfer_datetime"})
			})

			dateTime = request.arrival_transfer_datetime;
			dateTime.format = "yyyy-MM-dd'T'HH:mm:ss"; 
			getTimestampFromString@Time(dateTime)(arrivalTransferTimestamp)
		}
		
		/*
		* Dates are correct but now we need to verify if they are consequent. If they are not, then a Fault400 is thrown.
		*/
		if (arrivalTransferTimestamp <= departureTransferTimestamp) {
			throw (Fault400, {description = "departure_transfer_datetime comes later than arrival_transfer_datetime"})
		}

		/*
		* Checking if the airport code is valid. If it is not, then a Fault400 is thrown.
		*/
		matchRequest = request.airport_code
		matchRequest.regex = "[A-Z]{3,3}"
		match@StringUtils(matchRequest)(airportCodeOK)
		if (airportCodeOK == 0) {
			throw(Fault400, {description = "airport_code is not valid"})
		}

		/*
		* Changing date format from ISO 8601 to Italian date format in both departure_transfer_datetime and arrival_transfer_datetime.
		*/
		dateTime = request.departure_transfer_datetime;
		dateTime.format = "yyyy-MM-dd'T'HH:mm:ss";
		getTimestampFromString@Time(dateTime)(departureTransferTimestamp)
		// toTimestamp - 2h - early
		departureTransferTimestamp = departureTransferTimestamp - (1000 * 60 * 60 * 2)
		departureTransferTimestamp.format = "dd/MM/yyyy HH:mm:ss"
		getDateTime@Time(departureTransferTimestamp)(departureTime)

		dateTime = request.arrival_transfer_datetime;
		dateTime.format = "yyyy-MM-dd'T'HH:mm:ss";
		getTimestampFromString@Time(dateTime)(arrivalTransferTimestamp)
		arrivalTransferTimestamp.format = "dd/MM/yyyy HH:mm:ss"
		getDateTime@Time(arrivalTransferTimestamp)(arrivalTime)

		/*
		* Sending the message with information about the booked transfer.
		*/
		response.response = "AZIENDA " + request.rent_service + ". Trasporto prenotato da " + request.customer_address + " all'aeroporto " + request.airport_code + ". La navetta passerà in andata il: " + departureTime + " e al ritorno il: " + arrivalTime + "."
	}
}