import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditCarForm = () => {
    const { carId } = useParams();
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    const [carDetails, setCarDetails] = useState({
        title: '',
        description: '',
        tags: {
            car_type: '',
            company: '',
            dealer: '',
        },
    });
    const [images, setImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCarData = async () => {
            try {
                const response = await fetch(`${API_URL}/car/get/${carId}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const carData = await response.json();

                if (response.ok) {
                    setCarDetails({
                        title: carData.title,
                        description: carData.description,
                        tags: { ...carData.tags },
                    });
                    setImages(carData.images);
                } else {
                    setError('Failed to fetch car data');
                }
            } catch (err) {
                console.error('Error fetching car data:', err);
                setError('Error fetching car data');
            }
        };
        fetchCarData();
    }, [carId]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setCarDetails((prev) => ({
            ...prev,
            [id]: value,
            tags: {
                ...prev.tags,
                [id]: ['car_type', 'company', 'dealer'].includes(id) ? value : prev.tags[id],
            },
        }));
    };

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'b0uhjze6');

        const res = await fetch('https://api.cloudinary.com/v1_1/dvtha9rgq/image/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        return { url: data.secure_url, public_id: data.public_id };
    };

    const onImageChange = async (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const uploadedImage = await uploadToCloudinary(file);
            setImages((prevImages) => [...prevImages, uploadedImage]);
            setNewImages((prevNewImages) => [...prevNewImages, uploadedImage]);
        }
    };

    const handleImageDelete = (index, image) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
        if (!newImages.some((img) => img.url === image.url)) {
            setDeletedImages((prevDeletedImages) => [...prevDeletedImages, image.url]);
        } else {
            setNewImages((prevNewImages) => prevNewImages.filter((img) => img.url !== image.url));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/car/update/${carId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...carDetails,
                    addImages: newImages.map((img) => img.url),
                    deleteImages: deletedImages,
                }),
                credentials: 'include',
            });

            const result = await response.json();
            if (!response.ok) {
                setError(result.message || 'Failed to update car details');
                return;
            }
            Swal.fire('Updated!', 'Car updated successfully.', 'success');

            setNewImages([]);
            setDeletedImages([]);
            setError(null);
        } catch (error) {
            console.error('Error updating car details:', error);
            setError('Failed to update car details');
        }
    };

    return (
        <div className="w-screen font-sans bg-gray-50 py-12">
            <div className="container mx-auto max-w-3xl bg-white p-8 rounded-xl shadow-2xl transition-all duration-300 ease-in-out hover:shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-extrabold text-gray-900">Edit Car Details</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-8">
                        <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">Car Title</label>
                        <input
                            id="title"
                            type="text"
                            value={carDetails.title}
                            onChange={handleInputChange}
                            className="w-full p-5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
                        />
                    </div>

                    <div className="mb-8">
                        <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            id="description"
                            value={carDetails.description}
                            onChange={handleInputChange}
                            className="w-full p-5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
                            rows="5"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-8">
                        <div>
                            <label htmlFor="car_type" className="block text-lg font-medium text-gray-700 mb-2">Car Type</label>
                            <input
                                id="car_type"
                                type="text"
                                value={carDetails.tags.car_type}
                                onChange={handleInputChange}
                                className="w-full p-5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
                            />
                        </div>

                        <div>
                            <label htmlFor="dealer" className="block text-lg font-medium text-gray-700 mb-2">Dealer</label>
                            <input
                                id="dealer"
                                type="text"
                                value={carDetails.tags.dealer}
                                onChange={handleInputChange}
                                className="w-full p-5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
                            />
                        </div>

                        <div>
                            <label htmlFor="company" className="block text-lg font-medium text-gray-700 mb-2">Company</label>
                            <input
                                id="company"
                                type="text"
                                value={carDetails.tags.company}
                                onChange={handleInputChange}
                                className="w-full p-5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-lg font-medium text-gray-700 mb-2">Images</label>
                        <input
                            id="images"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onImageChange}
                        />
                        <button
                            type="button"
                            onClick={() => document.getElementById('images').click()}
                            className="cursor-pointer py-3 px-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
                        >
                            {images.length ? "Select More Images" : "Select Images"}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-8">
                        {images.map((image, index) => (
                            <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:scale-105">
                                <img
                                    src={image.url}
                                    alt="Car"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 transition-all duration-200 ease-in-out hover:bg-red-700"
                                    onClick={() => handleImageDelete(index, image)}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>

                    {error && <p className="text-red-600 mb-6">{error}</p>}

                    <div className="text-center">
                        <button
                            type="submit"
                            className="py-3 px-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
                        >
                            Update Car
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCarForm;
