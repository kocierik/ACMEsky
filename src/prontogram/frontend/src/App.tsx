import "./App.css";

interface IUserInterest {
  offerCode: number;
  departure_location: string;
  arrival_location: string;
  departure_date: string;
  arrival_date: string;
  max_price: number;
}

const userInterests : IUserInterest[] = [
  {
    offerCode: 10356,
    departure_location: "New York",
    arrival_location: "Los Angeles",
    departure_date: new Date("2024-04-15").toUTCString().slice(0,-3),
    arrival_date: new Date("2024-04-20").toUTCString().slice(0,-3),
    max_price: 500
  },
  {
    offerCode: 10357,
    departure_location: "Roma",
    arrival_location: "Rimini",
    departure_date: new Date("2024-02-15").toUTCString().slice(0,-3),
    arrival_date: new Date("2025-07-12").toUTCString().slice(0,-3),
    max_price: 1200
  },
]

function App() {

  return (
    <div className="flex flex-col overflow-x-auto">
      <h1 className="text-2xl flex-1 flex justify-center my-8">
      </h1>
      <div className="sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
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
                      {interest.offerCode}
                    </td>
                    <td className="whitespace-nowrap text-center py-4">
                      {interest.departure_location}
                    </td>
                    <td className="whitespace-nowrap text-center px-6 py-4">
                      {interest.arrival_location}
                    </td>
                    <td className="whitespace-nowrap text-center px-6 py-4">
                      {String(interest.departure_date)}
                    </td>
                    <td className="whitespace-nowrap text-center px-6 py-4">
                      {String(interest.arrival_date)}
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
