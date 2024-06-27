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

interface IUser {
  id: number;
  email: string;
}

function App() {

  const [userInterests, setUserInterests] = useState<IUserInterest[]>([]);
  const [userId,setUserId] = useState("")
  const userData: IUser = JSON.parse(localStorage.getItem('user_id') || '{}');
  console.log(userInterests);
  const fetchUserInterests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/getUser/${userData}/interests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserInterests(data);
      } else {
        console.error('Error fetching user interests:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user interests:', error);
    }
  };


  useEffect(()=> {
    fetchUserInterests()
  },[])

  function handleSearch(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
    console.log('Searching for user ID:', userId);
  }

  return (
    <div className="flex flex-col overflow-x-auto">
      <h1 className="text-2xl flex-1 flex justify-center my-8">
      </h1>
      <div className="sm:-mx-6 lg:-mx-8">
      <label className="mb-2 text-gray-500">
          Puoi trovare il tuo User ID nella sezione profilo del tuo account ACMEsky.
        </label>
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8 ">
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Inserisci User ID"
          className="border px-4 py-2 rounded mb-5"
        />
        <button
          onClick={handleSearch}
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
