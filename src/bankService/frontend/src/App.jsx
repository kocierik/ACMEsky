import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';

function App() {
  const [offer, setOffer] = useState(null);
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [securityCode, setSecurityCode] = useState("");

  async function fetchReceivedData() {
    try {
      const response = await fetch("http://localhost:3001/received-data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      const data = await response.json();
      setOffer(data);
      console.log(data);
    } catch (error) {
      console.error("Errore durante la richiesta dei dati:", error);
    }
  }
  useEffect(() => {
    fetchReceivedData();
  }, []);

  async function handlePayment(paymentData) {
    try {
      const response = await fetch(`http://localhost:3001/process-payment/${offer.codiceOfferta}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(paymentData),
      });
      const result = await response.json();
      // Gestisci la risposta del server
      console.log(result);
      Swal.fire({
        title: "Ottimo!",
        text: "Acquisto completato con successo! \n Riceverai il biglietto via mail.",
        icon: "success",
      }).then(_ => {
        window.location.href = `http://localhost:8080`;
      });
    } catch (error) {
      Swal.fire({
        title: 'Errore!',
        text: 'Si è verificato un errore durante il pagamento.',
        icon: 'error'
      });
      console.error("Errore durante il pagamento:", error);
    }
  }

  const handlePayNowClick = async () => {
    const paymentData = {
      nameOnCard,
      cardNumber,
      expirationDate,
      securityCode,
      amount: offer.price,
    };
    await handlePayment(paymentData);
  };

  return (
    <>
      <div className="flex flex-row flex-1">
        <div className="min-w-screen flex flex-1  bg-gray-200 flex items-center justify-center px-5 pb-10 pt-12">
          <div
            className="w-full mx-auto rounded-lg bg-white shadow-lg p-5 text-gray-700"
            style={{ maxWidth: "600px" }}
          >
            <div className="w-full pt-1 pb-5">
              <div className="bg-indigo-500 text-white overflow-hidden rounded-full w-20 h-20 -mt-16 mx-auto shadow-lg flex justify-center items-center">
                <i className="mdi mdi-credit-card-outline text-3xl"></i>
              </div>
            </div>
            <div className="mb-10">
              <h1 className="text-center font-bold text-xl uppercase">
                Secure payment info
              </h1>
            </div>
            <div className="mb-3">
              <label className="font-bold text-sm mb-2 ml-1">
                Name on card
              </label>
              <div>
                <input
                  className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="John Smith"
                  type="text"
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="font-bold text-sm mb-2 ml-1">Card number</label>
              <div>
                <input
                  className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="0000 0000 0000 0000"
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3 -mx-2 flex items-end">
              <div className="px-2 w-1/2">
                <label className="font-bold text-sm mb-2 ml-1">
                  Expiration date
                </label>
                <div>
                  <input
                    className="form-select w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                    placeholder="MM/YYYY"
                    type="text"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="px-2 w-1/2">
                <label className="font-bold text-sm mb-2 ml-1">Security code</label>
                <div>
                  <input
                    className="w-32 px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="000"
                    type="text"
                    value={securityCode}
                    onChange={(e) => setSecurityCode(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div>
              <button
                onClick={async () => await handlePayNowClick()}
                className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold"
              >
                PAY NOW
              </button>
            </div>
          </div>
        </div>
        <div className="flex p-5 bg-gray-200 rounded-lg">
          {offer && (
            <div className="shadow-lg flex items-center p-5 rounded-lg  overflow-hidden">
              <div className="px-6 py-4 flex flex-col bg-white">
                <div className="font-bold text-xl mb-2">Offerta</div>
                <div className="mb-2">
                  <span className="text-gray-700">Codice Offerta:</span>{" "}
                  {offer.codiceOfferta}
                </div>
                <div className="mb-2">
                  <span className="text-gray-700">Partenza:</span>{" "}
                  {offer.departureLocation}
                </div>
                <div className="mb-2">
                  <span className="text-gray-700">Arrivo:</span>{" "}
                  {offer.arrivalLocation}
                </div>
                <div className="mb-2">
                  <span className="text-gray-700">Data di Partenza:</span>{" "}
                  {offer.departureDate}
                </div>
                <div className="mb-2">
                  <span className="text-gray-700">Data di Arrivo:</span>{" "}
                  {offer.arrivalDate}
                </div>
                <div className="mb-2">
                  <span className="text-gray-700">Prezzo:</span> {offer.price}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
