import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { IoIosWarning } from "react-icons/io";

import '../css/Dashboard.css';
import leaf_icon from "../data/leaf_icon.svg";
import leaf1 from "../data/leaf1.jpg";
import leaf2 from "../data/leaf2.jpg";
import leaf3 from "../data/leaf3.jpg";

import { useData } from '../contexts/DataProvider';

// #region Skeleton Loaders
const SkeletonCard = () => (
  <div className="bg-white p-4 rounded shadow flex items-center gap-4 animate-pulse">
    <div className="bg-gray-200 h-10 w-10 rounded-full"></div>
    <div>
      <div className="bg-gray-200 h-4 w-20 mb-2 rounded"></div>
      <div className="bg-gray-300 h-6 w-24 rounded"></div>
    </div>
  </div>
);

const SkeletonChart = () => (
  <div className="bg-white p-4 rounded shadow animate-pulse">
    <div className="bg-gray-200 h-6 w-32 mb-4 rounded"></div>
    <div className="bg-gray-200 h-48 w-full rounded"></div>
  </div>
);

const SkeletonImageGrid = () => (
  <div className="bg-white p-4 rounded shadow animate-pulse">
    <div className="bg-gray-200 h-6 w-24 mb-4 rounded"></div>
    <div className="flex justify-center items-center mb-4">
      <div className="bg-gray-200 h-16 w-16 rounded-full"></div>
    </div>
    <div className="grid grid-cols-3 gap-2">
      <div className="bg-gray-200 h-20 w-full rounded"></div>
      <div className="bg-gray-200 h-20 w-full rounded"></div>
      <div className="bg-gray-200 h-20 w-full rounded"></div>
    </div>
  </div>
);

const SkeletonTable = () => (
  <div className="bg-white p-4 rounded shadow animate-pulse">
    <div className="bg-gray-200 h-6 w-28 mb-4 rounded"></div>
    <div className="bg-gray-100 h-8 w-full mb-2 rounded"></div>
    <div className="bg-gray-50 h-8 w-full mb-2 rounded"></div>
    <div className="bg-gray-100 h-8 w-full mb-2 rounded"></div>
    <div className="bg-gray-50 h-8 w-full rounded"></div>
  </div>
);
// #endregion

// #region Summary Card
function RotatableSummaryCard({ label, icon, weatherData, isLoading }) {
  let value = "N/A";
  const source = "Weather Forecast";

  const cardClasses = `bg-white p-4 rounded shadow flex items-center gap-4`;

  if (isLoading || !weatherData) return <SkeletonCard />;

  switch (label) {
    case "Temperature (Air)":
      value = weatherData?.temperature !== undefined ? `${weatherData.temperature}°C` : "N/A";
      break;
    case "Humidity":
      value = weatherData?.humidity !== undefined ? `${weatherData.humidity}%` : "N/A";
      break;
    case "UV Index":
      value = weatherData?.uvIndex !== undefined ? `${weatherData.uvIndex} lx` : "N/A";
      break;
    case "Wind Speed":
      value = weatherData?.windSpeed !== undefined ? `${weatherData.windSpeed} km/h` : "N/A";
      break;
    default:
      value = "N/A";
  }

  return (
    <div className={cardClasses}>
      <div className="text-2xl">{icon}</div>
      <div>
        <div className="text-gray-600 text-sm">{label}</div>
        <div className="text-lg font-bold">{value}</div>
        <div className="text-xs text-gray-400 mt-1">{source}</div>
      </div>
    </div>
  );
}
// #endregion

// #region Graphs and Sensors
function groupReadingsBySensor(sensorReadings, sensors) {
  const grouped = {};

  for (const reading of sensorReadings) {
    const sensorId = reading.SensorId;
    if (!grouped[sensorId]) {
      const sensorInfo = sensors.find(s => s.SensorId === sensorId);
      grouped[sensorId] = {
        sensor: sensorInfo || { Name: 'Unknown Sensor', Type: 'unknown' },
        readings: [],
      };
    }
    grouped[sensorId].readings.push(reading);
  }

  for (const group of Object.values(grouped)) {
    group.readings.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
  }

  return grouped;
}

const SENSOR_UNITS = {
  'pH': 'pH',
  'EC/TDS': 'µS/cm',
  'water_temperature': '°C',
  'dissolved_oxygen': 'ppm',
  'chlorophyll': 'SPAD',
  'ammonia': 'ppm',
  'nitrite': 'ppm',
  'nitrate': 'ppm',
  'air_temperature': '°C',
  'air_humidity': '%',
  'air_pressure': 'hPa',
  'light_level': 'lx',
};
// #endregion

function Dashboard() {
  const { weather, sensorReadings, farms, loading, sensors } = useData();
  const [activeSensorIndex, setActiveSensorIndex] = useState(0);
  const [manualMode, setManualMode] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [monthlyOnly, setMonthlyOnly] = useState(true);

  useEffect(() => {
    if (loading) return;
    const grouped = groupReadingsBySensor(sensorReadings, sensors);
    const total = Object.keys(grouped).length;

    if (!manualMode && total > 1) {
      const id = setTimeout(() => {
        setActiveSensorIndex((prev) => (prev + 1) % total);
      }, 30000);
      setTimeoutId(id);
      return () => clearTimeout(id);
    }
  }, [activeSensorIndex, manualMode, sensorReadings, sensors, loading]);

  const renderDashboardContent = () => {
    if (loading) {
      return (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <SkeletonChart />
            <SkeletonImageGrid />
          </div>
          <SkeletonTable />
        </>
      );
    }

    const groupedBySensor = groupReadingsBySensor(sensorReadings, sensors);
    const sensorKeys = Object.keys(groupedBySensor);
    const activeSensorId = sensorKeys[activeSensorIndex];
    const activeSensorData = groupedBySensor[activeSensorId];

    console.log("✅ groupedBySensor:", groupedBySensor);
    console.log("🔢 sensorKeys:", sensorKeys);
    console.log("📊 activeSensorData:", activeSensorData);

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

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const filteredReadings = monthlyOnly
      ? activeSensorData.readings.filter((r) => new Date(r.Timestamp) >= startOfMonth)
      : activeSensorData.readings;

    const handleManualSelect = (e) => {
      clearTimeout(timeoutId);
      setManualMode(true);
      setActiveSensorIndex(Number(e.target.value));

      setTimeout(() => {
        setManualMode(false);
      }, 180000);
    };

    return (
      <>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <RotatableSummaryCard label="Temperature (Air)" icon="🌡️" weatherData={weather} isLoading={loading} />
          <RotatableSummaryCard label="Humidity" icon="💧" weatherData={weather} isLoading={loading} />
          <RotatableSummaryCard label="UV Index" icon="☀️" weatherData={weather} isLoading={loading} />
          <RotatableSummaryCard label="Wind Speed" icon="💨" weatherData={weather} isLoading={loading} />
        </div>

        <div className="mb-4">
          <label className="mr-2 font-medium">Select Sensor:</label>
          <select value={activeSensorIndex} onChange={handleManualSelect} className="border px-2 py-1 rounded">
            {sensorKeys.map((key, index) => {
              const s = groupedBySensor[key].sensor;
              return (
                <option key={key} value={index}>
                  {s.Name} – {SENSOR_UNITS[s.Type] || s.Type}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <label className="font-medium">Show:</label>
          <select
            value={monthlyOnly ? "month" : "all"}
            onChange={(e) => setMonthlyOnly(e.target.value === "month")}
            className="border px-2 py-1 rounded"
          >
            <option value="month">This Month Only</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {activeSensorData && (
          <div key={activeSensorId} className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-lg font-semibold mb-2">
              {activeSensorData.sensor.Name} – {SENSOR_UNITS[activeSensorData.sensor.Type] || activeSensorData.sensor.Type}
            </h2>
            <ResponsiveContainer width="100%" height={200} debounce={200}>
              <LineChart
                data={filteredReadings.map((r) => ({
                  time: new Date(r.Timestamp).toLocaleString([], {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  }),
                  value: r.Value,
                }))}
              >
                <CartesianGrid stroke="#eee" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#22c55e" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-2xl font-bold text-center mb-6">🌿 Plants</h2>
        
        <div className="flex justify-center gap-6 flex-wrap">
          {[leaf1, leaf2, leaf3].map((imgSrc, i) => (
            <div key={i} className="relative w-64 h-64 overflow-hidden rounded-xl shadow-lg transition-transform transform hover:scale-105">
              <img
                src={imgSrc}
                alt={`Leaf ${i + 1}`}
                className="object-cover w-full h-full rounded-xl"
              />
            </div>
          ))}
        </div>
      </div>
      </>
    );
  };

  return (
    <div className="dashboard-container p-6 bg-gray-50 min-h-screen">
      {renderDashboardContent()}
    </div>
  );
}

export default Dashboard;