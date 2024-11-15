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
                    'credentials':'include'
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
        const API_URL = import.meta.env.VITE_API_BASE_URL;
        try {
            const response = await fetch(`${API_URL}/car/delete/${carId}`, {
                method: 'DELETE',
                'credentials':'include'
            });
            if(response.ok){
                navigate('/')
            }
        } catch (error) {
            console.error('Error deleting car:', error);
            return false;
        }
    };

    if (!car) return <p>Loading...</p>;

    return (
        <div className="w-screen min-h-screen font-sans bg-gray-50 text-gray-900">
            <div className="mx-auto max-w-screen-lg px-4 py-8">
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 text-blue-600 hover:underline"
                >
                    &larr; Back to Home
                </button>
                
                <h2 className="text-3xl font-bold mb-4">{car.title}</h2>
    
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    <div>
                        <img
                            src={mainImage}
                            alt={car.title}
                            className="rounded-lg shadow-lg w-full h-96 object-cover mb-4"
                        />
                        
                        <div className="flex space-x-4 overflow-x-auto">
                            {car.images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img.url}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={`cursor-pointer rounded-lg shadow-md w-24 h-24 object-cover ${
                                        mainImage === img.url ? 'ring-2 ring-blue-500' : ''
                                    }`}
                                    onClick={() => setMainImage(img.url)}
                                />
                            ))}
                        </div>
                    </div>
    
                    <div className="flex flex-col justify-start">
                        <div>
                            <p className="text-lg text-gray-700">{car.description}</p>
                            <div className="mt-4 text-gray-500">
                                <p><strong>Type:</strong> {car.tags.car_type}</p>
                                <p><strong>Company:</strong> {car.tags.company}</p>
                                <p><strong>Dealer:</strong> {car.tags.dealer}</p>
                            </div>
                        </div>
    
                        <div className="mt-8 flex space-x-4">
                            <button
                                onClick={() => navigate(`/editcar/${car._id}`)}
                                className="rounded bg-green-600 py-2 px-4 text-lg font-bold text-white"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="rounded bg-red-600 py-2 px-4 text-lg font-bold text-white"
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
