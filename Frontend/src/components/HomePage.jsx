import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


const HomePage = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCars, setFilteredCars] = useState([]);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch(`${API_URL}/cars/getall`, {
        'credentials': 'include'
      });
      const data = await response.json();
      setCars(data);
      setFilteredCars(data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const handleSearch = () => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = cars.filter(car =>
      car.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      car.description.toLowerCase().includes(lowerCaseSearchTerm) ||
      Object.values(car.tags).some(tag =>
        tag.toLowerCase().includes(lowerCaseSearchTerm)
      )
    );
    setFilteredCars(results);
  };

  const handleDelete = (carId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this car?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        deleteCar(carId);
      }
    });
  };
  const deleteCar = async (carId) => {
    const API_URL = import.meta.env.VITE_API_BASE_URL;
    try {
      const response = await fetch(`${API_URL}/car/delete/${carId}`, {
        method: 'DELETE',
        'credentials': 'include'
      });
      if (response.ok) {
        fetchCars()
        Swal.fire('Deleted!', 'The car has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      return false;
    }
  };


  return (
    <div className="w-screen  text-gray-900">
      <div className="mx-auto  w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
        <div className="mx-2 text-center md:mx-auto md:w-2/3">

          <h2 className="text-3xl font-black leading-4 sm:text-5xl xl:text-6xl">Car Management</h2>

          <div className="mt-4 flex justify-center">
            <input
              type="text"
              placeholder="Search cars..."
              className="shadow-sm w-2/3 rounded border border-gray-300 py-2 px-3 leading-tight outline-none ring-blue-500 focus:ring"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="ml-2 rounded bg-blue-600 py-2 px-4 text-lg font-bold text-white"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className='flex justify-end px-20'>

        <button
          onClick={() => { navigate('/addcar') }}
          className="ml-2  rounded bg-green-600 py-2 px-4 text-lg font-bold text-white"
        >
          Add New Car
        </button>
      </div>

      <div className="mx-auto p-4 w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
        <div className="mt-8 m-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCars.length > 0 ? (
            filteredCars.map(car => (
              <div
                key={car._id}
                className="shadow-lg rounded-lg border border-gray-100 py-4 px-6 hover:shadow-xl cursor-pointer transition-all"
                onClick={() => navigate(`/cardescription/${car._id}`)}
              >
                <h3 className="text-2xl font-bold mb-2">{car.title}</h3>
                <p className="text-gray-700 mb-4">{car.description}</p>
                <div className="text-sm text-gray-500 mb-4">
                  <strong>Type:</strong> {car.tags.car_type}<br />
                  <strong>Company:</strong> {car.tags.company}<br />
                  <strong>Dealer:</strong> {car.tags.dealer}
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/editcar/${car._id}`);
                    }}
                    className="cursor-pointer rounded bg-green-600 py-2 px-4 text-lg font-bold text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(car._id);
                    }}
                    className="cursor-pointer rounded bg-red-600 py-2 px-4 text-lg font-bold text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-8">No cars found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
