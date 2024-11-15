import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";

function Login() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error);
        return;
      }

      setUser({ email: "", password: "" });
      navigate("/");
    } catch (error) {
      setError("An error occurred during login");
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
      <div className="relative w-full max-w-md p-8 bg-white bg-opacity-70 rounded-3xl shadow-2xl backdrop-blur-md">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Welcome Back
        </h2>
        {error && (
          <p className="text-red-600 text-center text-sm mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FiMail className="absolute left-4 top-3 text-gray-400" />
            <input
              id="email"
              type="email"
              placeholder="Email Address"
              value={user.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 text-gray-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition"
              required
            />
          </div>
          <div className="relative">
            <FiLock className="absolute left-4 top-3 text-gray-400" />
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 text-gray-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold shadow-lg hover:scale-105 transform transition focus:ring-2 focus:ring-offset-2 focus:ring-pink-400"
          >
            Log In
          </button>
        </form>
        <p className="text-center text-sm text-gray-700 mt-4">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-pink-500 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
