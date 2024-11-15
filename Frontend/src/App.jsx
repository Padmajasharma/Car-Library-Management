import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./components/HomePage";
import Login  from "./components/Login";
import Signup from "./components/Signup";
import AddCarForm from "./components/AddCar";
import CarDescription from "./components/CarDescription";
import EditCarForm from "./components/EditCar";

function App() {
  return (
    <Router>
      <AuthCheck />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/addcar" element={<AddCarForm />} />
        <Route path="/cardescription/:carId" element={<CarDescription />} />
        <Route path="/editcar/:carId" element={<EditCarForm />} />
      </Routes>
    </Router>
  );
}

function AuthCheck() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/getuser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        navigate("/signup");
      }
    } catch (error) {
      console.error("Error checking authentication status", error);
      navigate("/signup");
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return null; 
}

export default App;
