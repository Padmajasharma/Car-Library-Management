import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CarDescription = () => {
    const { carId } = useParams();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    const [car, setCar] = useState(null);
    const [mainImage, setMainImage] = useState('');

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const response = await fetch(`${API_URL}/car/get/${carId}`, {
                    'credentials': 'include'
                });
                const data = await response.json();
                setCar(data);
                setMainImage(data.images[0].url);
            } catch (error) {
                console.error('Error fetching car details:', error);
            }
        };
        fetchCarDetails();
    }, [carId]);

    const handleDelete = () => {
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
        try {
            const response = await fetch(`${API_URL}/car/delete/${carId}`, {
                method: 'DELETE',
                'credentials': 'include'
            });
            if (response.ok) {
                navigate('/');
            }
        } catch (error) {
            console.error('Error deleting car:', error);
            return false;
        }
    };

    if (!car) return <p>Loading...</p>;

    return (
        <div className="w-screen min-h-screen bg-gray-50 font-sans text-gray-900">
            <div className="container mx-auto px-6 py-12 max-w-screen-xl">
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 text-blue-600 hover:underline text-lg"
                >
                    &larr; Back to Home
                </button>

                <h2 className="text-4xl font-extrabold text-gray-800 mb-6">{car.title}</h2>

                <div className="grid gap-8 lg:grid-cols-2 grid-cols-1">
                    <div>
                        <img
                            src={mainImage}
                            alt={car.title}
                            className="rounded-xl shadow-lg w-full h-96 object-cover mb-6 transition-all duration-300 ease-in-out hover:scale-105"
                        />

                        <div className="flex space-x-4 overflow-x-auto">
                            {car.images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img.url}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={`cursor-pointer rounded-lg shadow-md w-24 h-24 object-cover transition-all duration-200 ease-in-out transform hover:scale-110 ${
                                        mainImage === img.url ? 'ring-2 ring-blue-500' : ''
                                    }`}
                                    onClick={() => setMainImage(img.url)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col justify-between">
                        <div>
                            <p className="text-lg text-gray-700">{car.description}</p>
                            <div className="mt-4 text-gray-600">
                                <p><strong className="text-gray-800">Type:</strong> {car.tags.car_type}</p>
                                <p><strong className="text-gray-800">Company:</strong> {car.tags.company}</p>
                                <p><strong className="text-gray-800">Dealer:</strong> {car.tags.dealer}</p>
                            </div>
                        </div>

                        <div className="mt-8 flex space-x-4">
                            <button
                                onClick={() => navigate(`/editcar/${car._id}`)}
                                className="rounded-lg bg-green-600 py-3 px-6 text-white text-lg font-bold transition-all duration-300 ease-in-out hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="rounded-lg bg-red-600 py-3 px-6 text-white text-lg font-bold transition-all duration-300 ease-in-out hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDescription;
