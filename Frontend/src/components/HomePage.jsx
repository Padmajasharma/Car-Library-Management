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
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-blue-100 py-8">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
            Car Management System
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Manage your car inventory effortlessly.
          </p>
          <div className="flex justify-center items-center">
            <input
              type="text"
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-3 text-gray-700 rounded-lg shadow-sm border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              onClick={handleSearch}
              className="ml-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>
        </div>

        {/* Add Car Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={() => navigate("/addcar")}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition"
          >
            + Add New Car
          </button>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {filteredCars.length > 0 ? (
            filteredCars.map((car) => (
              <div
                key={car._id}
                onClick={() => navigate(`/cardescription/${car._id}`)}
                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition cursor-pointer"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {car.title}
                </h3>
                <p className="text-gray-600 mb-4">{car.description}</p>
                <div className="text-sm text-gray-500 space-y-1">
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
                <div className="flex justify-between mt-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/editcar/${car._id}`);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md font-medium shadow-md hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(car._id);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-md font-medium shadow-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-lg col-span-full">
              No cars found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
