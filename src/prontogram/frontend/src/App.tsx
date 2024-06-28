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

function App() {

  const [userInterests, _setUserInterests] = useState<IUserInterest[]>([]);
  const [userId,setUserId] = useState("")

  useEffect(()=> {
    // fetchUserInterests()
  },[])

  function fetchUserInterests(): void {
    console.log('Searching for UUID:', userId);
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
            <table className="min-w-full text-start text-sm ">
              <thead className="border-b border-neutral-200 ">
                <tr>
                <th scope="col" className="px-6 py-4">
                    Codice Offerta
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Luogo di Partenza
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Luogo di Arrivo
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Data di Partenza
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Data di Arrivo
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Prezzo Massimo
                  </th>
                </tr>
              </thead>
              <tbody>
                {userInterests.map((interest, i) => (
                  <tr
                    key={i}
                    className="border-b border-neutral-200 dark:border-white/10"
                  >
                    <td className="whitespace-nowrap text-center py-4">
                      {/* TODO: DA modificare poiche' il codice e' da prendere dal backend di prontogram */}
                      {interest.offerCode ? interest.offerCode : "Non Disponibile"}
                    </td>
                    <td className="whitespace-nowrap text-center py-4">
                      {interest.departure_location}
                    </td>
                    <td className="whitespace-nowrap text-center px-6 py-4">
                      {interest.arrival_location}
                    </td>
                    <td className="whitespace-nowrap text-center px-6 py-4">
                      {String(interest.from_date)}
                    </td>
                    <td className="whitespace-nowrap text-center px-6 py-4">
                      {String(interest.to_date)}
                    </td>
                    <td className="whitespace-nowrap text-center px-6 py-4">
                      {interest.max_price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
