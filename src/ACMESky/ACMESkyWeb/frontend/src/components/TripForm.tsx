import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';
import { BASE_URL } from '../utils/const';

interface FormData {
  departure_location: string;
  arrival_location: string;
  from_date: string;
  to_date: string;
  max_price: number;
  user_id: string;
}

const TripForm = () => {
  const [departure_location, setDepartureLocation] = useState('');
  const [arrival_location, setArrivalLocation] = useState('');
  const [from_date, setFromDate] = useState('');
  const [to_date, setToDate] = useState('');
  const [max_price, setMaxPrice] = useState(0);
  const navigate = useNavigate(); 
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData: FormData = {
      user_id: user.id,
      departure_location: departure_location,
      arrival_location: arrival_location,
      from_date: from_date,
      to_date: to_date,
      max_price
    };

    try {
      console.log(formData)
      const response = await fetch(`${BASE_URL}/createUserInterest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      Swal.fire({
        title: "Ottimo!",
        text: "Dati salvati correttamente!",
        icon: "success"
      });

      navigate('/profile');

      console.log('Data submitted successfully');
    } catch (error) {
      Swal.fire({
        title: "Ops!",
        text: "Errore durante il salvataggio dei dati!",
        icon: "error",
      });
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
                      <label htmlFor="departure_location">Volo di partenza</label>
                      <input type="text" name="departure_location" id="departure_location" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value={departure_location} onChange={(e) => setDepartureLocation(e.target.value)} placeholder="Milano" />
                    </div>
                    <div className="md:col-span-5">
                      <label htmlFor="arrival_location">Volo di arrivo</label>
                      <input type="text" name="arrival_location" id="arrival_location" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value={arrival_location} onChange={(e) => setArrivalLocation(e.target.value)} placeholder="Bologna" />
                    </div>
                    <div className="md:col-span-3">
                      {/* range */}
                      <label htmlFor="from_date">Partenza dal</label>
                      <input type="date" name="from_date" id="from_date" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value={from_date} onChange={(e) => setFromDate(e.target.value)} placeholder="" />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="to_date">Arrivo fino a</label>
                      <input type="date" name="to_date" id="to_date" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value={to_date} onChange={(e) => setToDate(e.target.value)} placeholder="" />
                    </div>
                    <div className="md:col-span-1">
                      <label htmlFor="max_price">Limite prezzo</label>
                      <input type="number" name="max_price" id="max_price" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value={max_price} onChange={(e) => setMaxPrice(Number(e.target.value))} placeholder="1000" />
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

