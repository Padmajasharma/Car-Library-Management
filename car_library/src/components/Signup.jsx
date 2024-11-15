import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";



function Signup() {
    const API_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (user.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/createuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
                'credentials': 'include',
            });

            const result = await response.json();
            console.log(result, response);
            if (!response.ok) {
                setError(result.error);
                return;
            }
            setUser({ name: '', email: '', password: '' });
            navigate('/');

        } catch (error) {
            setError(error.message)
            console.error('Error during signup:', error);
        }
    };

    return (
        <div className="bg-white w-screen font-sans text-gray-900">
            <div>
                <div className="mx-auto w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
                    <div className="mx-2 py-4 text-center md:mx-auto md:w-2/3 md:py-4">
                        <h2 className="text-3xl font-black leading-4 sm:text-5xl xl:text-6xl">
                            Create Account
                        </h2>
                    </div>
                </div>
            </div>
            <div className="md:w-2/3 mx-auto w-full pb-16 sm:max-w-screen-sm md:max-w-screen-md lg:w-1/3 lg:max-w-screen-lg xl:max-w-screen-xl">
                <form onSubmit={handleSubmit} className="shadow-lg mb-4 rounded-lg border border-gray-100 py-10 px-8">
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold" htmlFor="name">
                            Name
                        </label>
                        <input
                            className="shadow-sm w-full cursor-text appearance-none rounded border border-gray-300 py-2 px-3 leading-tight outline-none ring-blue-500 focus:ring"
                            id="name"
                            type="text"
                            placeholder="Name"
                            value={user.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold" htmlFor="email">
                            E-mail
                        </label>
                        <input
                            className="shadow-sm w-full cursor-text appearance-none rounded border border-gray-300 py-2 px-3 leading-tight outline-none ring-blue-500 focus:ring"
                            id="email"
                            type="email"
                            placeholder="email"
                            value={user.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow-sm w-full cursor-text appearance-none rounded border border-gray-300 py-2 px-3 leading-tight outline-none ring-blue-500 focus:ring"
                            id="password"
                            type="password"
                            placeholder="******************"
                            value={user.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex items-center">
                        <div className="flex-1"></div>
                        <button
                            className="cursor-pointer rounded bg-blue-600 py-2 px-8 text-center text-lg font-bold text-white"
                            type="submit"
                        >
                            Create account
                        </button>
                    </div>

                    <p className="text-blue-500 text-sm hover:text-blue-700 cursor-pointer">
                        Already have an account?{" "}
                        <Link to="/login" className="underline">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Signup;
