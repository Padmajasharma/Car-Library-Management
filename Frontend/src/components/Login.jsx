import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const API_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    const [user, setUser] = useState({
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
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
                credentials: 'include'
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error);
                return;
            }

            setUser({ email: '', password: '' });
            navigate('/');
        } catch (error) {
            setError('An error occurred during login');
            console.error('Error during login:', error);
        }
    };

    return (
        <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen flex flex-col justify-center items-center">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-3xl font-extrabold text-blue-600 text-center mb-6">
                    Login to Your Account
                </h1>
                <p className="text-gray-600 text-center mb-8">
                    Welcome back! Please enter your details to continue.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            value={user.email}
                            onChange={handleChange}
                            required
                            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:ring focus:ring-blue-300 focus:outline-none shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={user.password}
                            onChange={handleChange}
                            required
                            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:ring focus:ring-blue-300 focus:outline-none shadow-sm"
                        />
                    </div>
                    {error && (
                        <p className="text-red-500 text-center text-sm">
                            {error}
                        </p>
                    )}
                    <div className="flex justify-between items-center">
                        <Link
                            to="/reset-password"
                            className="text-sm text-blue-500 hover:underline"
                        >
                            Forgot password?
                        </Link>
                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 text-white font-bold px-6 py-2 shadow-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            Login
                        </button>
                    </div>
                </form>
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link
                            to="/signup"
                            className="text-blue-500 font-bold hover:underline"
                        >
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
