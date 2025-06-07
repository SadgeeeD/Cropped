import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Assuming you are using React Router

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear previous errors on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors

    // Client-side validation
    if (!formData.username || !formData.password) {
      setError("Please enter both username and password.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/login", formData);
      localStorage.setItem("token", res.data.token);
      alert("Login success!"); // Consider a more subtle success message
      navigate("/dashboard"); // Redirect to a dashboard page
    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Use specific error from backend
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Outer container for the shadowed background
    <div className="flex items-center justify-center min-h-screen bg-gray-800 shadow-inner-2xl"> {/* Darker background, inner shadow for depth */}
      {/* Login Card */}
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded-xl shadow-2xl space-y-6 w-96 transform transition-all duration-300 hover:scale-105" // More rounded, stronger shadow, subtle hover effect
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back!</h2> {/* Larger, bold title */}

        {error && <p className="text-red-600 text-center text-sm">{error}</p>}

        <div className="space-y-4"> {/* Group inputs for better spacing */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200" // More rounded input, subtle transition
            disabled={loading}
            aria-label="Username"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200" // More rounded input, subtle transition
            disabled={loading}
            aria-label="Password"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white p-3 rounded-lg w-full font-semibold hover:bg-green-700 transition duration-300 disabled:bg-green-300 disabled:cursor-not-allowed transform hover:-translate-y-0.5" // More rounded button, stronger hover effect
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Link to Register page (optional, but good for UX) */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <span
            className="text-green-600 hover:underline cursor-pointer font-medium"
            onClick={() => navigate("/register")} // Navigate to /register route
          >
            Register here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;