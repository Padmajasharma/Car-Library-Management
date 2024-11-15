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
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
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
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-400 py-16">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-extrabold text-white leading-tight mb-4">
            Manage Your Cars with Ease
          </h1>
          <p className="text-lg text-gray-100 max-w-2xl mx-auto opacity-80">
            Effortlessly organize and manage your car inventory with our intuitive and sleek dashboard.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center items-center mb-8 space-x-4">
          <input
            type="text"
            placeholder="Search cars by title, description, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-lg px-6 py-3 rounded-xl shadow-lg bg-white text-gray-700 border-2 border-gray-300 focus:ring-4 focus:ring-indigo-300 outline-none transition-all"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-xl hover:bg-indigo-700 hover:shadow-2xl transition-all"
          >
            Search
          </button>
        </div>

        {/* Add Car Button */}
        <div className="flex justify-end mb-12">
          <button
            onClick={() => navigate("/addcar")}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl shadow-xl hover:bg-green-600 hover:shadow-2xl transition-all"
          >
            + Add New Car
          </button>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredCars.length > 0 ? (
            filteredCars.map((car) => (
              <div
                key={car._id}
                onClick={() => navigate(`/cardescription/${car._id}`)}
                className="p-6 bg-white rounded-xl shadow-2xl hover:shadow-3xl transition-all cursor-pointer transform hover:scale-105"
              >
                <h3 className="text-3xl font-semibold text-gray-800 mb-4 hover:text-indigo-500 transition-colors">
                  {car.title}
                </h3>
                <p className="text-gray-600 mb-6">{car.description}</p>
                <div className="text-sm text-gray-500 space-y-1 mb-6">
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
                <div className="flex justify-between items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/editcar/${car._id}`);
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-md transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(car._id);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 shadow-md transition-all"
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
