import { useState, useEffect } from "react";
import { BASE_URL, BASE_URL_BANK, BASE_URL_GEO, BASE_URL_SSE } from "../utils/const";
import Swal from "sweetalert2";
import { convertToKilometers } from "../utils/convert";

interface IOffer {
  id: number;
  codice_offerta: string;
  departure_location: string;
  arrival_location: string;
  from_date: string; // Formato data come stringa (yyyy-mm-dd)
  to_date: string; // Formato data come stringa (yyyy-mm-dd)
  price: number; // Prezzo come numero decimale
  disponibile: boolean;
}

const OfferForm = () => {
  const [codiceOfferta, setCodiceOfferta] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [offer, setOffer] = useState<IOffer>();
  const [distance, setDistance] = useState<number | null>(0);


   // START handle SSE server
  useEffect(() => {
    const eventSource = new EventSource(`${BASE_URL_SSE}/events`);

    eventSource.addEventListener('flightInfos', event => {
      const data = JSON.parse(event.data);
      console.log('Received flight infos:', data);
    });

    eventSource.addEventListener('errors', event => {
      const data = JSON.parse(event.data);
      console.error('Received error:', data);
      Swal.fire({
        title: "Errore!",
        text: data.message,
        icon: "error",
      });
    });

    eventSource.addEventListener('paymentURL', event => {
      const data = JSON.parse(event.data);
      console.log('Received payment URL:', data);
      window.location.href = data.url; 
    });

    eventSource.addEventListener('tickets', event => {
      const data = JSON.parse(event.data);
      console.log('Received tickets:', data);
    });

    eventSource.onerror = (event) => {
      console.error('EventSource failed:', event);
    };

    return () => {
      eventSource.close();
    };
  }, []);
// END handle SSE server



  const handleSearch = async () => {
    try {
      const response = await fetch(`${BASE_URL}/checkoffert/${codiceOfferta}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

      if (!response.ok) {
        Swal.fire({
          title: "Ops!",
          text: "Offerta non esistente!",
          icon: "error",
        });
        return;
      }

      const data = await response.json();
      setOffer(data.offer);
      console.log(data);
      console.log("Risposta API:", data);
    } catch (error) {
      Swal.fire({
        title: "Ops!",
        text: "Si e' verificato un errore!",
        icon: "error",
      });
      console.error("Errore:", error);
    }
  };

  const handleBuy = async () => {
    if (!offer) {
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL_BANK}/checkout/${offer.codice_offerta}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            codiceOfferta: offer.codice_offerta,
            departureLocation: offer.departure_location,
            arrivalLocation: offer.arrival_location,
            departureDate: offer.from_date,
            arrivalDate: offer.to_date,
            price: offer.price,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Errore durante il checkout");
      }

      Swal.fire({
        title: "Successo!",
        text: "Richiesta inviata correttamente, verrai reindirizzato al pagamento.",
        icon: "success",
      }).then(() => {
        window.location.href = `http://localhost:8087/received-data/${offer.codice_offerta}`;
      });
    } catch (error) {
      console.error("Errore durante il checkout:", error);
      Swal.fire({
        title: "Errore!",
        text: "Si è verificato un errore durante il checkout.",
        icon: "error",
      });
    }
  };

  const handleDistance = async () => {
    try {
      console.log(offer)
      const response = await fetch(
        `${BASE_URL_GEO}/distance?origins=${domicilio}&destinations=${offer?.departure_location}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response)
      if (!response.ok) {
        throw new Error("Errore durante il calcolo della distanza");
      }

      const data = await response.json();
      console.log(data);
      const distanceInKilometers = convertToKilometers(data.distance);
      console.log(distanceInKilometers)
      if (distanceInKilometers != 0) {
        setDistance(distanceInKilometers);
      } else {
        setDistance(0)
      }
    } catch (error) {
      console.error("Errore durante il calcolo della distanza:", error);
      Swal.fire({
        title: "Errore!",
        text: "Si è verificato un errore durante il calcolo della distanza.",
        icon: "error",
      });
    }
  };


  return (
    <div className="p-3 bg-gray-100 flex flex-col items-center justify-center">
      <div className="container max-w-screen-sm mx-auto">
        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-2">
          <div className="flex flex-1 flex-col mb-1">
            <label htmlFor="full_name">Codice Offerta</label>
            <input
              type="text"
              name="codiceOfferta"
              id="codiceOfferta"
              className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
              value={codiceOfferta}
              onChange={(e) => setCodiceOfferta(e.target.value)}
              placeholder="47830"
            />
          </div>
          <div className="md:col-span-5 text-right mt-2">
            <div className="inline-flex items-end">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleSearch}
              >
                Cerca
              </button>
            </div>
          </div>
        </div>
      </div>
      {offer && (
        <>
          <div className="bg-white rounded flex flex-col  shadow-lg p-2 px-4 md:p-8 mb-2">
            <label htmlFor="domicilio">Domicilio</label>
            <div className="flex flex-1 flex-row mb-1">
              <input
                type="text"
                name="domicilio"
                id="domicilio"
                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                value={domicilio}
                onChange={(e) => setDomicilio(e.target.value)}
                placeholder="Bologna"
              />
              <div className="inline-flex p-1">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleDistance}
                >
                  Distanza
                </button>
              </div>
            </div>
            {distance != 0 && (
              <div className="flex flex-1 mt-1 flex-col mb-1">
                <p>Distanza: {distance} {' '} km</p>
                {(distance! < 30 && distance != 0) && "Hai diritto alla navetta fino all'aereoporto"}
              </div>
            )}
            {(distance! > 30 || distance == 0) && "Non hai diritto alla navetta fino all'aereoporto"}
          </div>
          <div className="flex flex-col overflow-x-auto flex-wrap">
            <div className="sm:-mx-6 lg:-mx-8 flex flex-1">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-start text-sm ">
                    <thead className="border-b border-neutral-200 ">
                      <tr>
                        <th scope="col" className="px-6 py-4">
                          Partenza
                        </th>
                        <th scope="col" className="px-6 py-4">
                          Arrivo
                        </th>
                        <th scope="col" className="px-6 py-4">
                          Data di Partenza
                        </th>
                        <th scope="col" className="px-6 py-4">
                          Data di Arrivo
                        </th>
                        <th scope="col" className="px-6 py-4">
                          prezzo
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-neutral-200 dark:border-white/10">
                        <td className="whitespace-nowrap text-center py-4">
                          {offer.departure_location}
                        </td>
                        <td className="whitespace-nowrap text-center px-6 py-4">
                          {offer.arrival_location}
                        </td>
                        <td className="whitespace-nowrap text-center px-6 py-4">
                          {String(offer.from_date)}
                        </td>
                        <td className="whitespace-nowrap text-center px-6 py-4">
                          {String(offer.to_date)}
                        </td>
                        <td className="whitespace-nowrap text-center px-6 py-4">
                          {offer.price}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="md:col-span-5 text-center mt-2 mb-5">
              <div className="inline-flex items-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleBuy}
                >
                  Acquista
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OfferForm;
