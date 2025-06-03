// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import api from '../services/API';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from 'recharts';

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

        setData({
          farms,
          readings,
          sensors,
          users,
          loading: false,
          error: null
        });
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

  // ✅ Prepare chart data (limit to recent 20 for performance)
  const chartData = data.readings.slice(0, 20).map(reading => ({
    time: new Date(reading.Timestamp).toLocaleTimeString(),
    value: reading.Value,
    sensorId: reading.SensorId,
  }));

  return (
    <div className="dashboard p-6">
      <h1 className="text-2xl font-bold mb-4">Farm Data Overview</h1>
      
      <div className="stats grid grid-cols-2 gap-4 mb-6">
        <div className="stat-card p-4 bg-white rounded shadow">
          <h3 className="text-lg font-semibold">Total Farms</h3>
          <p className="text-2xl">{data.farms.length}</p>
        </div>
        
        <div className="stat-card p-4 bg-white rounded shadow">
          <h3 className="text-lg font-semibold">Active Sensors</h3>
          <p className="text-2xl">{data.sensors.length}</p>
        </div>
      </div>

      <div className="chart-container bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Recent Sensor Readings</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#eee" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" name="Sensor Value" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="table-container bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Sensor Readings (Latest 5)</h2>
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Sensor ID</th>
              <th className="p-2 text-left">Value</th>
              <th className="p-2 text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {data.readings.slice(0, 5).map(reading => (
              <tr key={reading.ReadingId} className="border-b">
                <td className="p-2">{reading.SensorId}</td>
                <td className="p-2">{reading.Value} {reading.Unit}</td>
                <td className="p-2">{new Date(reading.Timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
