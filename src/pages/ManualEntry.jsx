import React, { useState } from "react";
import axios from "axios";
import "../css/ManualEntry.css"; // We'll create this CSS file

const ManualEntry = () => {
  const [formData, setFormData] = useState({
    nitrate: "",
    nitrite: "",
    ammonia: "",
    chlorophyll: "",
    dissolvedoxygen: "",
    notes: "",
    timestamp: new Date().toISOString(),
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/manual-entry", formData);
      alert("Data submitted successfully!");
      setFormData({
        nitrate: "",
        nitrite: "",
        ammonia: "",
        chlorophyll: "",
        dissolvedoxygen: "",
        notes: "",
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again.");
    }
  };

  return (
    <div className="manual-entry-container bg-gray-800 text-white pt-0 mt-0">
      <h2>Manual Data Entry</h2>
      <form onSubmit={handleSubmit} className="manual-entry-form">
        <div className="form-group">
          <label htmlFor="nitrate">Nitrate Level (mg/L):</label>
          <input
            type="number" // Use type="number" for numerical inputs
            name="nitrate"
            id="nitrate"
            value={formData.nitrate}
            onChange={handleChange}
            placeholder="e.g. 5.2"
            required
            step="0.01" // Allows decimal inputs
             min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="nitrite">Nitrite Level (mg/L):</label>
          <input
            type="number"
            name="nitrite"
            id="nitrite"
            value={formData.nitrite}
            onChange={handleChange}
            placeholder="e.g. 0.1"
            required
            step="0.01"
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="ammonia">Ammonia Level (mg/L):</label>
          <input
            type="number"
            name="ammonia"
            id="ammonia"
            value={formData.ammonia}
            onChange={handleChange}
            placeholder="e.g. 0.05"
            required
            step="0.01"
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dissolvedoxygen">Dissolved Oxygen (mg/L):</label>
          <input
            type="number"
            name="dissolvedoxygen"
            id="dissolvedoxygen"
            value={formData.dissolvedoxygen}
            onChange={handleChange}
            placeholder="e.g. 7.8"
            required
            step="0.1"
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="chlorophyll">Chlorophyll Level (µg/L):</label>
          <input
            type="number"
            name="chlorophyll"
            id="chlorophyll"
            value={formData.chlorophyll}
            onChange={handleChange}
            placeholder="e.g. 15.3"
            required
            step="0.1"
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes:</label>
          <textarea
            name="notes"
            id="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any additional observations here..."
            rows="4" // Make the textarea taller
          />
        </div>

        <button type="submit" className="submit-button">
          Submit Data
        </button>
      </form>
    </div>
  );
};

export default ManualEntry;