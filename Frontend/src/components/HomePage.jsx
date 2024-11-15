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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-gray-200 to-pink-100 py-12">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-6 transform transition duration-500 hover:scale-105">
            Manage Your Cars
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Easily organize and manage your car inventory with our user-friendly dashboard.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center items-center mb-10">
          <input
            type="text"
            placeholder="Search cars by title, description, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-lg px-5 py-3 rounded-2xl shadow-lg text-gray-700 border-2 border-gray-300 focus:ring-4 focus:ring-teal-300 outline-none transition-all transform duration-300"
          />
          <button
            onClick={handleSearch}
            className="ml-4 px-6 py-3 bg-teal-600 text-white font-semibold rounded-2xl shadow-lg hover:bg-teal-700 transition-all transform duration-300"
          >
            Search
          </button>
        </div>

        {/* Add Car Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => navigate("/addcar")}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-2xl shadow-lg hover:bg-green-600 transition-all transform duration-300"
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
                className="p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transform transition-all cursor-pointer hover:scale-105"
              >
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 transform transition duration-500 hover:text-teal-600">
                  {car.title}
                </h3>
                <p className="text-gray-600 mb-4">{car.description}</p>
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
                <div className="flex justify-between gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/editcar/${car._id}`);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 shadow-md transition-all"
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
