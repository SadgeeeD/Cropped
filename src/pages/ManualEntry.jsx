import React, { useState } from "react";
import axios from "axios";

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
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/manual-entry", formData);
      alert("Data submitted successfully!");
      setFormData({ nitrate: "", nitrite: "", ammonia: "", chlorophyll: "",dissolvedoxygen: "", notes: "", timestamp: new Date().toISOString() });
    } catch (err) {
      console.error(err);
      alert("Submission failed.");
    }
  };

  return (
    <div>
      <h2>Manual Entry</h2>
      <form onSubmit={handleSubmit}>
        <input name="nitrate" value={formData.nitrate} onChange={handleChange} placeholder="Nitrate Level" required />
        <input name="nitrite" value={formData.nitrite} onChange={handleChange} placeholder="Nitrite Level" required />
        <input name="ammonia" value={formData.ammonia} onChange={handleChange} placeholder="Ammonia Level" required />
        <input name="dissolved oxygen" value={formData.dissolvedoxygen} onChange={handleChange} placeholder="Dissolved Oxygen Level" required />
        <input name="chlorophyll" value={formData.chlorophyll} onChange={handleChange} placeholder="Chlorophyll Level" required />
        <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Notes" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ManualEntry;
