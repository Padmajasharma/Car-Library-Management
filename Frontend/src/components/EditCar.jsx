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
            dealer: ''
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
            }
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
        <div className="w-screen font-sans text-gray-900">
            <div className="mx-auto w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
                <div className="mx-2 text-center md:mx-auto md:w-2/3">
                    <h2 className="text-4xl font-extrabold text-indigo-600 sm:text-5xl xl:text-6xl">Edit Car Details</h2>
                </div>
            </div>
            <div className="mx-auto w-full pb-16 sm:max-w-screen-sm md:max-w-screen-md lg:w-[60%] lg:max-w-screen-lg xl:max-w-screen-xl">
                <form onSubmit={handleSubmit} className="shadow-xl rounded-lg bg-white p-8 mb-4 border-t-8 border-indigo-600">
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-sm font-semibold mb-2 text-gray-700">Title</label>
                        <input
                            id="title"
                            type="text"
                            value={carDetails.title}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-semibold mb-2 text-gray-700">Description</label>
                        <textarea
                            id="description"
                            value={carDetails.description}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="car_type" className="block text-sm font-semibold mb-2 text-gray-700">Car Type</label>
                        <input
                            id="car_type"
                            type="text"
                            value={carDetails.tags.car_type}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="dealer" className="block text-sm font-semibold mb-2 text-gray-700">Dealer</label>
                        <input
                            id="dealer"
                            type="text"
                            value={carDetails.tags.dealer}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="company" className="block text-sm font-semibold mb-2 text-gray-700">Company</label>
                        <input
                            id="company"
                            type="text"
                            value={carDetails.tags.company}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Images</label>
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
                            className="cursor-pointer rounded bg-indigo-600 py-2 px-8 text-lg font-semibold text-white"
                        >
                            {images.length ? "Select More Images" : "Select Images"}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {images.map((image, index) => (
                            <div key={index} className="relative w-24 h-24">
                                <img
                                    src={image.url}
                                    alt="Car"
                                    className="w-full h-full object-cover rounded-lg shadow-md"
                                />
                                <button
                                    type="button"
                                    className="absolute w-6 h-6 top-0 right-0 bg-red-600 text-white rounded-full text-sm font-bold"
                                    onClick={() => handleImageDelete(index, image)}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>

                    {error && <p className="text-red-600 mt-4">{error}</p>}

                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            className="cursor-pointer rounded bg-indigo-600 py-2 px-8 text-lg font-semibold text-white hover:bg-indigo-700"
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
