import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Assuming you use React Router

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // For redirection after successful registration

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error message on input change
    setSuccess(""); // Clear success message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // --- Client-side Validation ---
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

    // Basic email validation (you might want a more robust regex)
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    // --- End Client-side Validation ---

    try {
      // Send data to your backend registration API
      const res = await axios.post("http://localhost:5000/api/register", formData);

      setSuccess("Registration successful! You can now log in.");
      // Optionally, you might automatically log them in or redirect them to the login page
      // For now, let's just redirect to login after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Redirect after 2 seconds

    } catch (err) {
      console.error("Registration error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        // Display specific error message from the backend
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Outer container for the shadowed background, consistent with Login.jsx
    <div className="flex items-center justify-center min-h-screen bg-gray-800 shadow-inner-2xl">
      {/* Register Card, consistent with Login.jsx */}
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded-xl shadow-2xl space-y-6 w-96 transform transition-all duration-300 hover:scale-105"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Account</h2> {/* Consistent heading style */}

        {error && <p className="text-red-600 text-center text-sm">{error}</p>}
        {success && <p className="text-green-600 text-center text-sm">{success}</p>}

        <div className="space-y-4"> {/* Group inputs for better spacing */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200" // Consistent input style
            disabled={loading}
            aria-label="Username"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200" // Consistent input style
            disabled={loading}
            aria-label="Email"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200" // Consistent input style
            disabled={loading}
            aria-label="Password"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white p-3 rounded-lg w-full font-semibold hover:bg-green-700 transition duration-300 disabled:bg-green-300 disabled:cursor-not-allowed transform hover:-translate-y-0.5" // Consistent button style
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Link to Login page, consistent with Login.jsx */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <span
            className="text-green-600 hover:underline cursor-pointer font-medium"
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