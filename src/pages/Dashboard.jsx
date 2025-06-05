import React, { useState, useEffect } from 'react';
import api from '../services/API';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Pictures
import leaf_icon from "../data/leaf_icon.svg";
import leaf1 from "../data/leaf1.jpg";
import leaf2 from "../data/leaf2.jpg";
import leaf3 from "../data/leaf3.jpg";

// Helper components for skeleton loading
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
    <div className="bg-gray-200 h-6 w-32 mb-4 rounded"></div> {/* Title placeholder */}
    <div className="bg-gray-200 h-48 w-full rounded"></div> {/* Chart area placeholder */}
  </div>
);

const SkeletonImageGrid = () => (
  <div className="bg-white p-4 rounded shadow animate-pulse">
    <div className="bg-gray-200 h-6 w-24 mb-4 rounded"></div> {/* Title placeholder */}
    <div className="flex justify-center items-center mb-4">
      <div className="bg-gray-200 h-16 w-16 rounded-full"></div> {/* Main icon placeholder */}
    </div>
    <div className="grid grid-cols-3 gap-2">
      <div className="bg-gray-200 h-20 w-full rounded"></div> {/* Image placeholder */}
      <div className="bg-gray-200 h-20 w-full rounded"></div> {/* Image placeholder */}
      <div className="bg-gray-200 h-20 w-full rounded"></div> {/* Image placeholder */}
    </div>
  </div>
);

const SkeletonTable = () => (
  <div className="bg-white p-4 rounded shadow animate-pulse">
    <div className="bg-gray-200 h-6 w-28 mb-4 rounded"></div> {/* Title placeholder */}
    <div className="bg-gray-100 h-8 w-full mb-2 rounded"></div> {/* Table header placeholder */}
    <div className="bg-gray-50 h-8 w-full mb-2 rounded"></div> {/* Row 1 placeholder */}
    <div className="bg-gray-100 h-8 w-full mb-2 rounded"></div> {/* Row 2 placeholder */}
    <div className="bg-gray-50 h-8 w-full rounded"></div> {/* Row 3 placeholder */}
  </div>
);


function Dashboard() {
  const [data, setData] = useState({
    farms: [],
    readings: [],
    sensors: [],
    users: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate a longer loading time for demonstration
        await new Promise(resolve => setTimeout(resolve, 1500));

        const [farms, readings, sensors, users] = await Promise.all([
          api.getFarms(),
          api.getSensorReadings(),
          api.getSensors(),
          api.getUsers()
        ]);

        setData({ farms, readings, sensors, users, loading: false, error: null });
      } catch (error) {
        // Log the error for debugging
        console.error("Dashboard data fetch error:", error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error.response?.data?.message || error.message || "Failed to fetch data. Please check your connection."
        }));
      }
    };

    fetchData();
  }, []);

  // Prepare chart data only if readings are available
  const chartData = data.readings.length > 0
    ? data.readings.slice(0, 20).map(reading => ({
        time: new Date(reading.Timestamp).toLocaleTimeString(),
        value: reading.Value,
      }))
    : [];

  // Conditional rendering for the main dashboard content
  const renderDashboardContent = () => {
    if (data.loading) {
      return (
        // Render skeleton screens while loading
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

    if (data.error) {
      return (
        // Render an error message within the layout
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Data Error!</strong>
          <span className="block sm:inline"> {data.error}</span>
          <p className="mt-2 text-sm">Attempting to display static layout with default values.</p>
          {/* You might want to add a retry button here */}
        </div>
        // Proceed to render the dashboard layout with placeholder/default data below
      );
    }

  function RotatableSummaryCard({ label, icon, weatherData, sensorData, displayMode, isLoading }) {
  let value = "N/A";
  let source = "";

  // Apply a subtle fade-in animation using Tailwind's transition classes
  // The actual "swiping" effect might require a carousel library, but this
  // will make the content change smoothly.
  const cardClasses = `bg-white p-4 rounded shadow flex items-center gap-4 transition-opacity duration-500 ease-in-out`;

  if (isLoading) {
    return <SkeletonCard />;
  }

  // Determine which data to show based on the displayMode
  if (displayMode === 'weather') {
    source = "Weather Forecast";
    switch (label) {
      case "Temperature": value = weatherData?.temperature !== undefined ? `${weatherData.temperature}°C` : "N/A"; break;
      case "Humidity": value = weatherData?.humidity !== undefined ? `${weatherData.humidity}%` : "N/A"; break;
      case "Light": value = weatherData?.light !== undefined ? `${weatherData.light} lx` : "N/A"; break;
      case "Wind Speed": value = weatherData?.windSpeed !== undefined ? `${weatherData.windSpeed} km/h` : "N/A"; break;
      // Add other weather-specific metrics if needed
      default: value = "N/A";
    }
  } else if (displayMode === 'bme280') {
    source = "BME280 Sensor";
    switch (label) {
      case "Temperature": value = sensorData?.temperature !== undefined ? `${sensorData.temperature}°C` : "N/A"; break;
      case "Humidity": value = sensorData?.humidity !== undefined ? `${sensorData.humidity}%` : "N/A"; break;
      case "Light": value = sensorData?.light !== undefined ? `${sensorData.light} m` : "N/A"; break;
      case "Pressure": value = sensorData?.pressure !== undefined ? `${sensorData.pressure} hPa` : "N/A"; break;
      default: value = "N/A";
    }
  }

  return (
    <div className={cardClasses}>
      <div className="text-2xl">{icon}</div>
      <div>
        <div className="text-gray-600 text-sm">{label}</div>
        <div className="text-lg font-bold">{value}</div>
        <div className="text-xs text-gray-400 mt-1">{source}</div> {/* Source indicator */}
      </div>
    </div>
  );
}



    // Render actual data when successfully loaded and no error
    return (
      <>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <SummaryCard label="Temperature" value="72°F" icon="🌡️" />
          <SummaryCard label="Humidity" value="55%" icon="💧" />
          <SummaryCard label="Light" value="3900 lx" icon="☀️" />
          <SummaryCard label="Water" value="50%" icon="🪣" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Sensor Data</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#eee" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#22c55e" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Healthy</h2>
            <div className="flex justify-center items-center mb-4">
              <img src={leaf_icon} alt="Healthy Leaf" className="w-16 h-16" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <img src={leaf1} className="rounded shadow" />
              <img src={leaf2} className="rounded shadow" />
              <img src={leaf3} className="rounded shadow" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Plant</h2>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2">Plant</th>
                <th className="text-left p-2">Health</th>
                <th className="text-left p-2">Growth Stage</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Plante', health: 'Healthy', stage: 'Seedling' },
                { name: 'Bee 3', health: 'Healthy', stage: 'Vegetative' },
                { name: 'Vegetiaile', health: 'Healthy', stage: 'Seedling' }
              ].map((plant, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{plant.name}</td>
                  <td className="p-2"><span className="bg-green-100 text-green-700 px-2 py-1 rounded">{plant.health}</span></td>
                  <td className="p-2">{plant.stage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* This ensures the main dashboard structure always renders */}
      {renderDashboardContent()}
    </div>
  );
}

function SummaryCard({ label, value, icon }) {
  return (
    <div className="bg-white p-4 rounded shadow flex items-center gap-4">
      <div className="text-2xl">{icon}</div>
      <div>
        <div className="text-gray-600">{label}</div>
        <div className="text-lg font-bold">{value}</div>
      </div>
    </div>
  );
}

export default Dashboard;