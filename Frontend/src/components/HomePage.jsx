import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const HomePage = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCars, setFilteredCars] = useState([]);

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
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  const handleSearch = () => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = cars.filter(
      (car) =>
        car.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        car.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        Object.values(car.tags).some((tag) =>
          tag.toLowerCase().includes(lowerCaseSearchTerm)
        )
    );
    setFilteredCars(results);
  };

  const handleDelete = (carId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#3498db",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        deleteCar(carId);
      }
    });
  };

  const deleteCar = async (carId) => {
    try {
      const response = await fetch(`${API_URL}/car/delete/${carId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        fetchCars();
        Swal.fire("Deleted!", "The car has been removed.", "success");
      }
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-pink-100 via-indigo-100 to-teal-200 py-16">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gradient bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text mb-4">
            Manage Your Cars
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Effortlessly manage your car inventory with our sleek and intuitive dashboard.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center items-center mb-12">
          <input
            type="text"
            placeholder="Search cars by title, description, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-lg px-5 py-3 rounded-lg shadow-xl text-gray-800 border-2 border-pink-500 focus:ring-4 focus:ring-teal-400 outline-none transition-all transform duration-300 ease-in-out"
          />
          <button
            onClick={handleSearch}
            className="ml-4 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold rounded-lg shadow-xl hover:bg-gradient-to-r hover:from-teal-400 hover:to-blue-400 transition-all transform duration-300 ease-in-out"
          >
            Search
          </button>
        </div>

        {/* Add Car Button */}
        <div className="flex justify-end mb-10">
          <button
            onClick={() => navigate("/addcar")}
            className="px-6 py-3 bg-gradient-to-r from-green-400 to-lime-500 text-white font-semibold rounded-lg shadow-xl hover:bg-gradient-to-r hover:from-green-300 hover:to-lime-400 transition-all transform duration-300 ease-in-out"
          >
            + Add New Car
          </button>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredCars.length > 0 ? (
            filteredCars.map((car) => (
              <div
                key={car._id}
                onClick={() => navigate(`/cardescription/${car._id}`)}
                className="p-8 bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all transform duration-500 cursor-pointer hover:scale-105"
              >
                <h3 className="text-3xl font-semibold text-gradient bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text mb-4 transform transition-all duration-500 hover:text-teal-500">
                  {car.title}
                </h3>
                <p className="text-gray-700 mb-4">{car.description}</p>
                <div className="text-sm text-gray-500 space-y-1 mb-4">
                  <p>
                    <strong>Type:</strong> {car.tags.car_type}
                  </p>
                  <p>
                    <strong>Company:</strong> {car.tags.company}
                  </p>
                  <p>
                    <strong>Dealer:</strong> {car.tags.dealer}
                  </p>
                </div>
                <div className="flex justify-between gap-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/editcar/${car._id}`);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium shadow-md hover:bg-gradient-to-r hover:from-indigo-400 hover:to-purple-400 transition-all transform duration-300 ease-in-out"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(car._id);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-medium shadow-md hover:bg-gradient-to-r hover:from-red-400 hover:to-pink-400 transition-all transform duration-300 ease-in-out"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-lg col-span-full">
              No cars found. Try searching with different keywords.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
