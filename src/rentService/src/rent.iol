type buyTransfersRequest: void {
	.customer_address: string
	.airport_code: string
	.departure_transfer_datetime: string
	.arrival_transfer_datetime: string
	.customer_name: string
	.rent_service: string
}

type buyTransfersResponse: void {
	.response: string
}

type buyTransfersError: void {
	.description: string
}

interface RentServiceInterface {
RequestResponse:
	/**!
	* Allows to buy a transfer from buyTransfersRequest.customer_address to buyTransfersRequest on date and time buyTransfersRequest.departure_transfer_datetime
	* and a transfer in the opposite direction on date and time  buyTransfersRequest.arrival_transfer_datetime.
	*/
	buyTransfers( buyTransfersRequest )( buyTransfersResponse ) throws Fault400( buyTransfersError )
}
