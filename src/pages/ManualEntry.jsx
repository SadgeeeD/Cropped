import React, { useState } from "react";
import axios from "axios";
import { useData } from "../contexts/DataProvider";
import { IoIosWarning } from "react-icons/io";
import "../css/ManualEntry.css";

const SENSOR_LABELS = {
  nitrate: "Nitrate",
  nitrite: "Nitrite",
  ammonia: "Ammonia",
  chlorophyll: "Chlorophyll",
  dissolved_oxygen: "Dissolved Oxygen",
};

const SENSOR_UNITS = {
  chlorophyll: "SPAD",
  default: "ppm",
};

const ManualEntry = () => {
  const { farms, sensors } = useData();
  const [selectedFarmId, setSelectedFarmId] = useState("");
  const [entries, setEntries] = useState([{ type: "nitrate", value: "" }]);
  const [notes, setNotes] = useState("");
  const [submittedReadings, setSubmittedReadings] = useState([]);
  const [formWarning, setFormWarning] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterTime, setFilterTime] = useState("all");

  const handleEntryChange = (index, field, newValue) => {
    const updated = [...entries];
    updated[index][field] = newValue;
    setEntries(updated);
  };

  const addEntry = () => {
    setEntries([...entries, { type: "nitrate", value: "" }]);
  };

  const removeEntry = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormWarning("");

    const newReadings = [];

    for (const entry of entries) {
      const value = parseFloat(entry.value);
      const type = entry.type;

      if (!isNaN(value) && selectedFarmId) {
        const sensor = sensors.find(
          (s) => s.Type === type && String(s.FarmId) === String(selectedFarmId)
        );

        if (sensor) {
          console.log(`Matched Sensor: ID=${sensor.SensorId}, Type=${sensor.Type}, FarmId=${sensor.FarmId}`);

          newReadings.push({
            SensorId: sensor.SensorId,
            Value: value,
            Timestamp: new Date().toISOString(),
            Unit: type === "chlorophyll" ? "SPAD" : "ppm",
          });
        } else {
          console.warn(`No matching sensor for Type="${type}" and FarmId="${selectedFarmId}"`);
        }
      }
    }

    if (newReadings.length === 0) {
      setFormWarning("Please enter at least one valid reading with a matching sensor.");
      return;
    }

    try {
      await Promise.all(
        newReadings.map((entry) =>
          axios.post("http://localhost:5000/manualEntry", entry)
        )
      );
      setSubmittedReadings([...submittedReadings, ...newReadings]);
      alert("Data submitted successfully!");
      setEntries([{ type: "nitrate", value: "" }]);
      setNotes("");
    } catch (err) {
      console.error("Submission error:", err);
      alert("Submission failed.");
    }
  };

  const activeSensorData = sensors && sensors.length > 0;
  if (!activeSensorData) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-6 bg-red-50 dark:bg-[#2c1b1e] border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg shadow-md flex items-center gap-4">
        <IoIosWarning className="h-6 w-6 text-red-500 dark:text-red-400" />
        <div>
          <h2 className="text-lg font-semibold">API Unavailable</h2>
          <p className="text-sm mt-1">
            We're unable to retrieve sensor data at the moment. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="manual-entry-container flex flex-row gap-6 p-6 min-h-screen">
      {/* Left Panel: Submitted Entries */}
      <div className="flex-1 p-4 rounded shadow-md bg-[var(--home-bg)] text-[var(--home-text)]">
        <h2 className="text-xl font-bold mb-4">Past Entries</h2>

        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:gap-4">
          <div className="flex-1">
            <label className="text-sm font-semibold">Filter by Sensor Type:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white"
            >
              <option value="all">All</option>
              {Object.entries(SENSOR_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-semibold">Time Period:</label>
            <select
              value={filterTime}
              onChange={(e) => setFilterTime(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white"
            >
              <option value="all">All Time</option>
              <option value="7">Past Week</option>
              <option value="30">Past 30 Days</option>
              <option value="90">Past 3 Months</option>
            </select>
          </div>
        </div>

        {submittedReadings.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No manual entries submitted yet.</p>
        ) : (
          <div className="overflow-y-auto max-h-[500px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-400 dark:border-gray-600">
                  <th className="py-2">Sensor Type</th>
                  <th>Value</th>
                  <th>Unit</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {submittedReadings
                  .filter((r) => {
                    if (filterType === "all") return true;
                    const sensor = sensors.find((s) => s.SensorId === r.SensorId);
                    return sensor?.Type === filterType;
                  })
                  .map((r, idx) => {
                    const sensor = sensors.find((s) => s.SensorId === r.SensorId);
                    const type = sensor?.Type || "unknown";
                    return (
                      <tr key={idx} className="border-t border-gray-300 dark:border-gray-700">
                        <td className="py-2">{SENSOR_LABELS[type] || type}</td>
                        <td>{r.Value}</td>
                        <td>{r.Unit}</td>
                        <td>{new Date(r.Timestamp).toLocaleString()}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Right Panel: Form */}
      <div className="flex-1 p-4 rounded shadow-md bg-[var(--home-bg)] text-[var(--home-text)]">
        <h2 className="text-xl font-bold mb-4">Manual Data Entry</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="farm" className="block mb-1 font-semibold">Select Location:</label>
            <select
              id="farm"
              value={selectedFarmId}
              onChange={(e) => setSelectedFarmId(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white"
              required
            >
              <option value="">-- Select Farm --</option>
              {farms.map((farm) => (
                <option key={farm.FarmId} value={farm.FarmId}>
                  {farm.Location || `Farm ${farm.FarmId}`}
                </option>
              ))}
            </select>
          </div>

          {entries.map((entry, index) => (
            <div className="flex gap-2 items-end mb-3" key={index}>
              <div className="flex-1">
                <label className="block mb-1 font-semibold">Sensor Type:</label>
                <select
                  value={entry.type}
                  onChange={(e) => handleEntryChange(index, "type", e.target.value)}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white"
                >
                  {Object.keys(SENSOR_LABELS).map((type) => (
                    <option key={type} value={type}>
                      {SENSOR_LABELS[type]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-semibold">Value:</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={entry.value}
                  onChange={(e) => handleEntryChange(index, "value", e.target.value)}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white"
                />
              </div>
              <button
                type="button"
                onClick={() => removeEntry(index)}
                className="text-red-500 hover:text-red-700 text-xl"
                title="Remove"
              >
                −
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addEntry}
            className="mb-4 px-3 py-1 rounded font-semibold bg-[var(--btn-primary)] hover:bg-[var(--btn-primary-hover)] text-white"
          >
            + Add Another Reading
          </button>

          <div className="mb-4">
            <label htmlFor="notes" className="block mb-1 font-semibold">Notes:</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white"
              rows="3"
            />
          </div>

          {formWarning && <p className="text-red-500 mb-4">{formWarning}</p>}

          <button
            type="submit"
            className="w-full px-4 py-2 rounded text-white font-semibold bg-[var(--btn-primary)] hover:bg-[var(--btn-primary-hover)]"
          >
            Submit Data
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManualEntry;
