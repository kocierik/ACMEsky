import React, { useState } from 'react';

interface FormData {
  departureLocation: string;
  arrivalLocation: string;
  departureDate: string;
  arrivalDate: string;
  maxPrice: number;
  user_id: number;
}

const TripForm: React.FC = () => {
  const [departureLocation, setDepartureLocation] = useState('');
  const [arrivalLocation, setArrivalLocation] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [maxPrice, setMaxPrice] = useState(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData: FormData = {
      departureLocation,
      user_id: 5, // TODO: FIX
      arrivalLocation,
      departureDate,
      arrivalDate,
      maxPrice
    };

    try {
      console.log(formData)
      const response = await fetch('http://localhost:3000/createUserInterest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Replace with your token
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Handle success
      console.log('Data submitted successfully');
    } catch (error) {
      console.error('There was an error submitting the form:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 flex items-center justify-center">
      <div className="container max-w-screen-lg mx-auto">
        <div>
          <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                <div className="text-gray-600">
                  <p className="font-medium text-lg">Seleziona il volo di tuo interesse</p>
                </div>

                <div className="lg:col-span-2">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-5">
                      <label htmlFor="departureLocation">Volo di partenza</label>
                      <input type="text" name="departureLocation" id="departureLocation" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value={departureLocation} onChange={(e) => setDepartureLocation(e.target.value)} placeholder="Milano" />
                    </div>
                    <div className="md:col-span-5">
                      <label htmlFor="arrivalLocation">Volo di arrivo</label>
                      <input type="text" name="arrivalLocation" id="arrivalLocation" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value={arrivalLocation} onChange={(e) => setArrivalLocation(e.target.value)} placeholder="Bologna" />
                    </div>
                    <div className="md:col-span-3">
                      <label htmlFor="departureDate">Data di partenza</label>
                      <input type="date" name="departureDate" id="departureDate" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} placeholder="" />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="arrivalDate">Data di arrivo</label>
                      <input type="date" name="arrivalDate" id="arrivalDate" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} placeholder="" />
                    </div>
                    <div className="md:col-span-1">
                      <label htmlFor="maxPrice">Limite prezzo</label>
                      <input type="number" name="maxPrice" id="maxPrice" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} placeholder="1000" />
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Salva</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripForm;

