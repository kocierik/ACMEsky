import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { BASE_URL } from './utils/const'
import { generateAndDownloadPDF } from "./utils/util";

export interface IFlight {
  flight_code: string;
  departure_location: string;
  arrival_location: string;
  arrival_date: string; // Formato data come stringa (yyyy-mm-dd)
  departure_date: string; // Formato data come stringa (yyyy-mm-dd)
  airline_name: string;
  price: number; // Prezzo come numero decimale
}

export interface IOffer {
  amount: number;
  payment_receiver: string;
  offer_code: string;
  description: string;
  flights: IFlight[];
}

interface IPayment {
  nameOnCard: string;
  cardNumber: string;
  expirationDate: string;
  securityCode: string;
  amount: number;
}

function App() {
  const { paymentCode } = useParams();

  const [offer, setOffer] = useState<IOffer | undefined>(undefined);
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [securityCode, setSecurityCode] = useState("");


  async function fetchOfferData() {
    try {
      const response = await fetch(`${BASE_URL}/${paymentCode}`, { method: "GET" });
      if (!response.ok) {
        Swal.fire({
          title: "Ops!",
          text: "Codice pagamento non valido!",
          icon: "error",
        });
      }
      const data = await response.json();
      setOffer(data);
    } catch (error) {
      console.error("Errore durante la richiesta dei dati:", error);
    }
  }
  useEffect(() => {
    fetchOfferData();
  }, []);

  async function handlePayment() {
    const paymentData: IPayment = {
      nameOnCard,
      cardNumber,
      expirationDate,
      securityCode,
      amount: offer!.amount,
    };
    try {
      const response = await fetch(`${BASE_URL}/buy/${paymentCode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(paymentData),
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      Swal.fire({
        title: "Ottimo!",
        text: "Acquisto completato con successo!\nPuoi tornare alla pagine di ACMESky",
        icon: "success",
      }).then((result: { isConfirmed: any; }) => {
        if (result.isConfirmed && offer) {
          generateAndDownloadPDF(offer).catch(error => {
            console.error('Errore nella generazione del PDF:', error);
            Swal.fire({
              title: 'Errore!',
              text: 'Si è verificato un errore durante la generazione del PDF.',
              icon: 'error'
            });
          });
        }
      });
    } catch (error) {
      Swal.fire({
        title: 'Errore!',
        text: 'Si è verificato un errore durante il pagamento: ' + error,
        icon: 'error'
      });
    }
  }

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
                Info Pagamento
              </h1>
            </div>
            <div className="mb-3">
              <label className="font-bold text-sm mb-2 ml-1">
                Nome Intestatario
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
              <label className="font-bold text-sm mb-2 ml-1">Numero Carta</label>
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
                  Data di scadenza
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
                onClick={async () => await handlePayment()}
                className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold"
              >
                PAGA ORA
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
                  <span className="text-gray-700">Descrizione:</span>{" "}
                  {offer.description}
                </div>
                <div className="mb-2">
                  <span className="text-gray-700">Codice Offerta:</span>{" "}
                  {offer.offer_code}
                </div>
                <div className="mb-2">
                  <span className="text-gray-700">Pagamento versato a:</span>{" "}
                  {offer.payment_receiver}
                </div>
                <div className="mb-2">
                  <span className="text-gray-700">Prezzo Totale:</span> {offer.amount}
                </div>
                <div className="mb-2">
                  <span className="text-gray-700">Volo di andata:</span>{" "} 
                  {offer.flights[0].airline_name} - {offer.flights[0].flight_code}<br />
                  {offer.flights[0].departure_location} -&gt; {offer.flights[0].arrival_location} {offer.flights[0].departure_date} -&gt; {offer.flights[0].arrival_date}
                </div>
                <div className="mb-2">
                  <span className="text-gray-700">Volo di ritorno:</span>{" "} 
                  {offer.flights[1].airline_name} - {offer.flights[1].flight_code}<br />
                  {offer.flights[1].departure_location} -&gt; {offer.flights[1].arrival_location} {offer.flights[1].departure_date} -&gt; {offer.flights[1].arrival_date}
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
