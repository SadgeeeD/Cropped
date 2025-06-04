import React, { useState, useEffect } from 'react';
import api from '../services/API';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

//Pictures
import leaf_icon from "../data/leaf_icon.svg";
import leaf1  from "../data/leaf1.jpg";
import leaf2  from "../data/leaf2.jpg";
import leaf3  from "../data/leaf3.jpg";


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
        const [farms, readings, sensors, users] = await Promise.all([
          api.getFarms(),
          api.getSensorReadings(),
          api.getSensors(),
          api.getUsers()
        ]);

        setData({ farms, readings, sensors, users, loading: false, error: null });
      } catch (error) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: error.response?.data?.message || error.message
        }));
      }
    };

    fetchData();
  }, []);

  if (data.loading) return <div>Loading...</div>;
  if (data.error) return <div>Error: {data.error}</div>;

  const chartData = data.readings.slice(0, 20).map(reading => ({
    time: new Date(reading.Timestamp).toLocaleTimeString(),
    value: reading.Value,
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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
            <img src= { leaf_icon } alt="Healthy Leaf" className="w-16 h-16" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <img src= { leaf1 } className="rounded shadow" />
            <img src= { leaf2 } className="rounded shadow" />
            <img src= { leaf3 } className="rounded shadow" />
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
