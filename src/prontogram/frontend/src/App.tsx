import { useEffect, useState } from "react";
import "./App.css";

interface IUserInterest {
  offerCode: number;
  departure_location: string;
  arrival_location: string;
  from_date: string;
  to_date: string;
  max_price: number;
}

interface OfferI {
  user_id : string
  activation_code: string
  message: string
}

function App() {

  const [userInterests, _setUserInterests] = useState<IUserInterest[]>([]);
  const [userId,setUserId] = useState("")
  const [offers,setOffers] = useState<OfferI>()

  useEffect(()=> {
    // fetchUserInterests()
  },[])

  async function fetchUserInterests() {
    console.log('Searching for UUID:', userId);
    const response = await fetch(`/api/offers?id=${userId}`)
    const data = await response.json()
    setOffers(data)
    console.log("data offers --> ", data);
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

          <div className="overflow-x-auto">
            Il tuo codice di attivazione è {offers?.activation_code}
            {offers?.message}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
