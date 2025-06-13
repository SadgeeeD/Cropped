import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataProvider';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

const SENSOR_UNITS = {
  'pH': 'pH', 'EC/TDS': 'µS/cm', 'water_temperature': '°C',
  'dissolved_oxygen': 'mg/L', 'chlorophyll': 'SPAD', 'ammonia': 'mg/L',
  'nitrite': 'mg/L', 'nitrate': 'mg/L', 'air_temperature': '°C',
  'air_humidity': '%', 'air_pressure': 'hPa', 'light_level': 'lx',
};

function History() {
  const { sensorReadings, sensors } = useData();

  const [filters, setFilters] = useState({
    sensorId: '',
    startDate: '',
    endDate: '',
    minValue: '',
    maxValue: '',
  });

  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!filters.sensorId) {
      setMinDate('');
      setMaxDate('');
      return;
    }

    const readings = sensorReadings
      .filter(r => r.SensorId === parseInt(filters.sensorId))
      .sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));

    if (readings.length > 0) {
      setMinDate(new Date(readings[0].Timestamp).toISOString().split('T')[0]);
      setMaxDate(new Date(readings[readings.length - 1].Timestamp).toISOString().split('T')[0]);
    } else {
      setMinDate('');
      setMaxDate('');
    }
  }, [filters.sensorId, sensorReadings]);

  const resetFilters = () => {
    setFilters({
      sensorId: '',
      startDate: '',
      endDate: '',
      minValue: '',
      maxValue: '',
    });
  };

  const filteredReadings = sensorReadings
    .filter(r => {
      const ts = new Date(r.Timestamp);
      const sensor = sensors.find(s => s.SensorId === r.SensorId);
      return (
        (!filters.sensorId || r.SensorId === parseInt(filters.sensorId)) &&
        (!filters.startDate || ts >= new Date(filters.startDate)) &&
        (!filters.endDate || ts <= new Date(filters.endDate)) &&
        (!filters.minValue || r.Value >= parseFloat(filters.minValue)) &&
        (!filters.maxValue || r.Value <= parseFloat(filters.maxValue))
      );
    })
    .sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));

  const activeSensor = sensors.find(s => s.SensorId === parseInt(filters.sensorId));
  const unit = activeSensor ? SENSOR_UNITS[activeSensor.Type] || activeSensor.Type : '';

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Sensor History</h1>
      <button
        onClick={() => setShowFilters(prev => !prev)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>
      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Sensor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sensor</label>
            <select
              value={filters.sensorId}
              onChange={(e) => setFilters(f => ({ ...f, sensorId: e.target.value }))}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select Sensor</option>
              {sensors.map(sensor => {
                const unit = SENSOR_UNITS[sensor.Type] || sensor.Type;
                return (
                  <option key={sensor.SensorId} value={sensor.SensorId}>
                    {sensor.Name} ({unit})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <div className="flex flex-col gap-2">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Start Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  min={minDate}
                  max={filters.endDate || maxDate}
                  onChange={(e) => setFilters(f => ({ ...f, startDate: e.target.value }))}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">End Date</label>
                <input
                  type="date"
                  value={filters.endDate}
                  min={filters.startDate || minDate}
                  max={maxDate}
                  onChange={(e) => setFilters(f => ({ ...f, endDate: e.target.value }))}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            </div>
          </div>

          {/* Value Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Value Range</label>
            <div className="flex flex-col gap-2">
              <input
                type="number"
                placeholder="Min Value"
                value={filters.minValue}
                onChange={(e) => setFilters(f => ({ ...f, minValue: e.target.value }))}
                className="border px-3 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Max Value"
                value={filters.maxValue}
                onChange={(e) => setFilters(f => ({ ...f, maxValue: e.target.value }))}
                className="border px-3 py-2 rounded"
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={resetFilters}
            className="bg-red-100 text-red-800 px-4 py-2 rounded hover:bg-red-200"
          >
            Reset Filters
          </button>
        </div>
      </div>
      )}

      {/* Chart */}
      {filters.sensorId ? (
        filteredReadings.length > 0 ? (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">
              {activeSensor?.Name} ({unit})
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={filteredReadings.map(r => ({
                  time: new Date(r.Timestamp).toLocaleString(),
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
        ) : (
          <p className="text-gray-500">No data found for the selected filters.</p>
        )
      ) : null}
    </div>
  );
}

export default History;
