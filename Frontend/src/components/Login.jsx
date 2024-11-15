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
        <div className="bg-gradient-to-r from-blue-50 via-white to-blue-100 min-h-screen flex flex-col justify-center items-center font-sans text-gray-900">
            <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-4xl font-bold text-blue-600 text-center mb-6">Welcome Back</h2>
                <p className="text-gray-600 text-sm text-center mb-8">
                    Enter your credentials to access your account
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={user.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={user.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {error && (
                        <p className="text-red-500 text-sm text-center">
                            {error}
                        </p>
                    )}
                    <div className="flex items-center justify-between">
                        <Link to="/reset-password" className="text-sm text-blue-500 hover:underline">
                            Forgot password?
                        </Link>
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 py-2 px-6 text-white font-bold hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            Login
                        </button>
                    </div>
                </form>
                <p className="text-center text-gray-600 text-sm mt-6">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-500 font-medium hover:underline">
                        Sign up here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
