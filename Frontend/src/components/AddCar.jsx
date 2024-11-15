import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const AddCarForm = () => {
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    const [carDetails, setCarDetails] = useState({
        title: '',
        description: '',
        tags: {
            car_type: '',
            company: '',
            dealer: '',
        }
    });
    const [images, setImages] = useState([]);
    const [error, setError] = useState();

    const handleInputChange = (e) => {
        const { id, value } = e.target;

        if (['car_type', 'company', 'dealer'].includes(id)) {
            setCarDetails(prev => ({
                ...prev,
                tags: {
                    ...prev.tags,
                    [id]: value
                }
            }));
        } else {
            setCarDetails(prev => ({ ...prev, [id]: value }));
        }
    };

    const onImageChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const uploadedImages = Array.from(event.target.files).map((file) =>
                URL.createObjectURL(file)
            );
            setImages(prevImages => [...prevImages, ...uploadedImages]);
        }
    };



    const handleImageUpload = async (files) => {
        const uploadedImages = [];

        for (let file of files) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'b0uhjze6');
            const res = await fetch('https://api.cloudinary.com/v1_1/dvtha9rgq/image/upload', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            uploadedImages.push({ url: data.secure_url, public_id: data.public_id });
        }

        return uploadedImages;
    };

    const handleImageDelete = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (images.length === 0) {
            setError('Please upload at least one image');
            return;
        }

        const files = Array.from(e.target.images.files);
        const uploadedImages = await handleImageUpload(files);

        console.log(carDetails);

        try {
            const response = await fetch(`${API_URL}/car/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...carDetails, images: uploadedImages }),
                'credentials': 'include',
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error);
                return;
            }
            Swal.fire('Added!', 'Car added successfully.', 'success');

            setCarDetails({
                title: '',
                description: '',
                tags: {
                    car_type: '',
                    company: '',
                    dealer: '',
                },
            });
            setImages([]);
            setError(null);

        } catch (error) {
            console.error('Error submitting car details:', error);
            setError('Failed to submit car details');
        }
    };

    return (
        <div className="w-screen font-sans text-gray-900">
            <div className="mx-auto w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
                <div className="mx-2 text-center md:mx-auto md:w-2/3">
                    <h2 className="text-3xl font-black leading-4 sm:text-5xl xl:text-6xl">Add Car</h2>
                </div>
            </div>
            <div className=" mx-auto w-full pb-16 sm:max-w-screen-sm md:max-w-screen-md lg:w-[60%] lg:max-w-screen-lg xl:max-w-screen-xl">
                <form onSubmit={handleSubmit} className="shadow-lg mb-4 rounded-lg border border-gray-100 py-10 px-8">
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold" htmlFor="title">
                            Title
                        </label>
                        <input
                            className="shadow-sm w-full cursor-text appearance-none rounded border border-gray-300 py-2 px-3 leading-tight outline-none ring-blue-500 focus:ring"
                            id="title"
                            type="text"
                            placeholder="Enter title"
                            value={carDetails.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            className="shadow-sm w-full cursor-text appearance-none rounded border border-gray-300 py-2 px-3 leading-tight outline-none ring-blue-500 focus:ring"
                            id="description"
                            type="text"
                            placeholder="Enter description"
                            value={carDetails.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold" htmlFor="car_type">
                            Car Type
                        </label>
                        <input
                            className="shadow-sm w-full cursor-text appearance-none rounded border border-gray-300 py-2 px-3 leading-tight outline-none ring-blue-500 focus:ring"
                            id="car_type"
                            type="text"
                            placeholder="Enter car type"
                            value={carDetails.tags.car_type}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold" htmlFor="company">
                            Company
                        </label>
                        <input
                            className="shadow-sm w-full cursor-text appearance-none rounded border border-gray-300 py-2 px-3 leading-tight outline-none ring-blue-500 focus:ring"
                            id="company"
                            type="text"
                            placeholder="Enter company"
                            value={carDetails.tags.company}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold" htmlFor="dealer">
                            Dealer
                        </label>
                        <input
                            className="shadow-sm w-full cursor-text appearance-none rounded border border-gray-300 py-2 px-3 leading-tight outline-none ring-blue-500 focus:ring"
                            id="dealer"
                            type="text"
                            placeholder="Enter dealer"
                            value={carDetails.tags.dealer}
                            onChange={handleInputChange}
                            required
                        />
                    </div>


                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold">Images</label>
                        <input
                            id="images"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={onImageChange}
                        />
                        <button
                            type="button"
                            onClick={() => document.getElementById('images').click()}
                            className="cursor-pointer rounded bg-blue-600 py-2 px-8 text-center text-lg font-bold text-white"
                        >
                            {images.length ? "Select More Images" : "Select Images"}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {images.map((image, index) => (
                            <div key={index} className="relative w-20 h-20">
                                <img
                                    src={image}
                                    alt="Car"
                                    className="w-full h-full object-cover rounded"
                                />
                                <button
                                    type="button"
                                    className="absolute w-8 h-8 top-0 right-0 bg-red-500 text-white rounded-full px-1"
                                    onClick={() => handleImageDelete(index)}
                                >
                                    X
                                </button>
                            </div>
                        ))}

                    </div>

                    {error && <p className="text-red-600 mt-4">{error}</p>}

                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            className="cursor-pointer rounded bg-blue-600 py-2 px-8 text-lg font-bold text-white"
                        >
                            Add Car
                        </button>
                    </div>
                </form>
            </div>
        </div >
    );
};

export default AddCarForm;
