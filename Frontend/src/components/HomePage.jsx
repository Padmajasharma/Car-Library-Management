import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiPlus, FiEdit, FiTrash } from "react-icons/fi";

function HomePage() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCars, setFilteredCars] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch(`${API_URL}/cars/getall`, {
        credentials: "include",
      });
      const data = await response.json();
      setCars(data);
      setFilteredCars(data);
    } catch (err) {
      setError("Failed to fetch cars. Please try again later.");
    }
  };

  const handleSearch = () => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = cars.filter((car) =>
      car.title.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredCars(results);
  };

  const handleDelete = async (carId) => {
    try {
      const response = await fetch(`${API_URL}/car/delete/${carId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setCars((prevCars) => prevCars.filter((car) => car._id !== carId));
        setFilteredCars((prevCars) =>
          prevCars.filter((car) => car._id !== carId)
        );
      } else {
        setError("Failed to delete the car. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while deleting the car.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
      <div className="relative w-full max-w-6xl p-8 bg-white bg-opacity-80 rounded-3xl shadow-2xl backdrop-blur-md">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-6">
          Car Management
        </h1>
        {error && (
          <p className="text-red-600 text-center text-sm mb-4">{error}</p>
        )}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 text-gray-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold shadow-lg hover:scale-105 transform transition focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
          >
            Search
          </button>
        </div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Car Listings</h2>
          <button
            onClick={() => navigate("/addcar")}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 transform transition focus:ring-2 focus:ring-offset-2 focus:ring-pink-400"
          >
            <FiPlus />
            Add Car
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.length > 0 ? (
            filteredCars.map((car) => (
              <div
                key={car._id}
                className="p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {car.title}
                </h3>
                <p className="text-gray-600 mb-4">{car.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/editcar/${car._id}`)}
                    className="flex-1 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition"
                  >
                    <FiEdit />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(car._id)}
                    className="flex-1 flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition"
                  >
                    <FiTrash />
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 text-lg col-span-full">
              No cars found. Try searching with a different term.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
