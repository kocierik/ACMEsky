import { useState, useEffect } from 'react';

interface IUser {
  id: number;
  email: string;
}

interface IUserInterest {
  id: number;
  departure_location: string;
  arrival_location: string;
  departure_date: Date;
  arrival_date: Date;
  max_price: number;
}

function Profile() {
  const [userData, setUserData] = useState<IUser | null>(null);
  const [userInterests, setUserInterests] = useState<IUserInterest[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/getUser', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error('Error fetching user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserInterests = async () => {
      try {
        const token = localStorage.getItem('token');
        // const response = await fetch(`http://localhost:3000/getUser/1/interests`, {
        const response = await fetch(`http://localhost:3000/getUser/${userData?.id}/interests`, {
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

    if (userData?.id) {
      fetchUserInterests();
    }
  }, [userData]);

  return (
    <div className="flex flex-col overflow-x-auto">
      <h1 className='text-2xl flex-1 flex justify-center my-8'>Bentornato {userData?.email}</h1>
      <div className="sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-x-auto">
            <table className="min-w-full text-start text-sm ">
              <thead className="border-b border-neutral-200 ">
                <tr>
                  <th scope="col" className="px-6 py-4">Departure Location</th>
                  <th scope="col" className="px-6 py-4">Arrival Location</th>
                  <th scope="col" className="px-6 py-4">Departure Date</th>
                  <th scope="col" className="px-6 py-4">Arrival Date</th>
                  <th scope="col" className="px-6 py-4">Max Price</th>
                </tr>
              </thead>
              <tbody>
                {userInterests.map((interest, i) => (
                  <tr key={i} className="border-b border-neutral-200 dark:border-white/10">
                    <td className="whitespace-nowrap text-center py-4">{interest.departure_location}</td>
                    <td className="whitespace-nowrap text-center px-6 py-4">{interest.arrival_location}</td>
                    <td className="whitespace-nowrap text-center px-6 py-4">{String(interest.departure_date)}</td>
                    <td className="whitespace-nowrap text-center px-6 py-4">{String(interest.arrival_date)}</td>
                    <td className="whitespace-nowrap text-center px-6 py-4">{interest.max_price}</td>
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

export default Profile;

