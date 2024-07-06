import { useState } from "react";
import "./App.css";
import { BASE_URL_PRONTOGRAM } from "./utils/const";

interface OfferI {
  user_id: string
  activation_code: string
  message: string
}

function App() {

  const [userId, setUserId] = useState("")
  const [offers, setOffers] = useState<OfferI[]>()

  async function fetchUserInterests() {
    console.log('Searching for UUID:', userId);
    const response = await fetch(`${BASE_URL_PRONTOGRAM}/api/offers?id=${userId}`)
    const data = await response.json()
    setOffers(data.offers)
    console.log("data offers --> ", data.offers);
  }

  return (
    <div className="flex flex-col overflow-x-auto">
      <h1 className="text-2xl flex-1 flex justify-center my-8">
      </h1>
      <div className="sm:-mx-6 lg:-mx-8">
        <label className="mb-2 text-gray-500">
          Puoi trovare il tuo UUID nella sezione profilo del tuo account ACMEsky.
        </label>
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8 ">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Inserisci UUID"
            className="border px-4 py-2 rounded mb-5"
          />
          <button
            onClick={fetchUserInterests}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Cerca Offerte
          </button>

          <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Le tue offerte</h2>
            {offers && offers.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {offers.map((offer, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-gray-500">Offerta #{i + 1}</span>
                      <span className="px-2 py-1 text-xs font-bold bg-green-500 rounded-full">
                        Active
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">Codice di attivazione</h3>
                    <p className="text-2xl font-mono bg-gray-100 p-2 rounded mb-4">
                      {offer?.activation_code}
                    </p>
                    <h4 className="text-md font-semibold mb-2">Descrizione</h4>
                    <p className="text-gray-700" dangerouslySetInnerHTML={{__html: offer?.message.replaceAll('\n', '<br />')}}></p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">Nessuna offerta disponibile al momento.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
