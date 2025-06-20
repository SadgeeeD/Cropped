import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/register", formData);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800 dark:bg-[#121212] transition-colors">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-white rounded-xl shadow-2xl space-y-6 w-96 transform transition-all duration-300 hover:scale-105"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        {success && <p className="text-green-500 text-center text-sm">{success}</p>}

        <div className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#3a3a3a] text-gray-800 dark:text-white p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            disabled={loading}
            aria-label="Username"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#3a3a3a] text-gray-800 dark:text-white p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            disabled={loading}
            aria-label="Email"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#3a3a3a] text-gray-800 dark:text-white p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            disabled={loading}
            aria-label="Password"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white p-3 rounded-lg w-full font-semibold hover:bg-green-700 transition duration-300 disabled:bg-green-300 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-4">
          Already have an account?{" "}
          <span
            className="text-green-500 hover:underline cursor-pointer font-medium"
            onClick={() => navigate("/login")}
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
