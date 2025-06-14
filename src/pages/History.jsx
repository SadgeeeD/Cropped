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
  const { sensorReadings, sensors, farms } = useData();

  const [filters, setFilters] = useState({
    sensorIds: [],
    startDate: '',
    endDate: '',
    minValue: '',
    maxValue: '',
    farmIds: [],
  });

  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [tileView, setTileView] = useState(false);

  useEffect(() => {
    if (filters.sensorIds.length === 0) {
      setMinDate('');
      setMaxDate('');
      return;
    }

    const filtered = sensorReadings
      .filter(r => filters.sensorIds.includes(String(r.SensorId)))
      .sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));

    if (filtered.length > 0) {
      setMinDate(new Date(filtered[0].Timestamp).toISOString().split('T')[0]);
      setMaxDate(new Date(filtered[filtered.length - 1].Timestamp).toISOString().split('T')[0]);
    } else {
      setMinDate('');
      setMaxDate('');
    }
  }, [filters.sensorIds, sensorReadings]);

  const resetFilters = () => {
    setFilters({
      sensorIds: [],
      startDate: '',
      endDate: '',
      minValue: '',
      maxValue: '',
      farmIds: [],
    });
  };

  const getFilteredReadingsBySensor = (sensorId) => {
    return sensorReadings
      .filter(r => {
        const ts = new Date(r.Timestamp);
        const sensor = sensors.find(s => s.SensorId === r.SensorId);
        const matchesFarm = filters.farmIds.length === 0 || (sensor && filters.farmIds.includes(String(sensor.FarmId)));

        return (
          r.SensorId === parseInt(sensorId) &&
          matchesFarm &&
          (!filters.startDate || ts >= new Date(filters.startDate)) &&
          (!filters.endDate || ts <= new Date(filters.endDate)) &&
          (!filters.minValue || r.Value >= parseFloat(filters.minValue)) &&
          (!filters.maxValue || r.Value <= parseFloat(filters.maxValue))
        );
      })
      .sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Sensor History</h1>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setShowFilters(prev => !prev)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        <button
          onClick={() => setTileView(prev => !prev)}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          {tileView ? 'Switch to Full View' : 'Switch to Tile View'}
        </button>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Farm Location</label>
              <div className="flex flex-col gap-1 max-h-40 overflow-y-auto p-2 bg-white rounded border border-gray-200">

                {/* Show All Farms Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-100 transition font-semibold">
                  <input
                    type="checkbox"
                    checked={filters.farmIds.length === farms.length}
                    onChange={(e) => {
                      setFilters(f => ({
                        ...f,
                        farmIds: e.target.checked
                          ? farms.map(farm => String(farm.FarmId))
                          : [],
                      }));
                    }}
                    className="h-4 w-4 rounded text-blue-600 border-gray-300 focus:ring focus:ring-blue-200"
                  />
                  <span className="text-sm text-gray-800">Show All Farms</span>
                </label>

                {/* Individual Farm Checkboxes */}
                {farms.map(farm => (
                  <label
                    key={farm.FarmId}
                    className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50 transition"
                  >
                    <input
                      type="checkbox"
                      value={farm.FarmId}
                      checked={filters.farmIds.includes(String(farm.FarmId))}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFilters(f => ({
                          ...f,
                          farmIds: f.farmIds.includes(value)
                            ? f.farmIds.filter(id => id !== value)
                            : [...f.farmIds, value],
                        }));
                      }}
                      className="h-4 w-4 rounded text-blue-600 border-gray-300 focus:ring focus:ring-blue-200"
                    />
                    <span className="text-sm text-gray-700">{farm.Location}</span>
                  </label>
                ))}
              </div>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sensors</label>
              <div className="flex flex-col gap-1 max-h-40 overflow-y-auto p-2 bg-white rounded border border-gray-200">
                
                {/* Show All Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-100 transition font-semibold">
                  <input
                    type="checkbox"
                    checked={filters.sensorIds.length === sensors.length}
                    onChange={(e) => {
                      setFilters(f => ({
                        ...f,
                        sensorIds: e.target.checked
                          ? sensors.map(s => String(s.SensorId))
                          : [],
                      }));
                    }}
                    className="h-4 w-4 rounded text-blue-600 border-gray-300 focus:ring focus:ring-blue-200"
                  />
                  <span className="text-sm text-gray-800">Show All Sensors</span>
                </label>

                {/* Individual Sensor Checkboxes */}
                {sensors.map(sensor => {
                  const unit = SENSOR_UNITS[sensor.Type] || sensor.Type;
                  return (
                    <label
                      key={sensor.SensorId}
                      className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50 transition"
                    >
                      <input
                        type="checkbox"
                        value={sensor.SensorId}
                        checked={filters.sensorIds.includes(String(sensor.SensorId))}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFilters(f => ({
                            ...f,
                            sensorIds: f.sensorIds.includes(value)
                              ? f.sensorIds.filter(id => id !== value)
                              : [...f.sensorIds, value],
                          }));
                        }}
                        className="h-4 w-4 rounded text-blue-600 border-gray-300 focus:ring focus:ring-blue-200"
                      />
                      <span className="text-sm text-gray-700">
                        {sensor.Name} ({unit})
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>


            {/* Date Range */}
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

            {/* Value Range */}
            <div className="flex flex-col justify-start">
              <label className="block text-sm font-medium text-gray-700 mb-1">Value Range</label>
              <div className="flex flex-col gap-2">
                <input
                  type="number"
                  placeholder="Min Value"
                  value={filters.minValue}
                  onChange={(e) => setFilters(f => ({ ...f, minValue: e.target.value }))}
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="number"
                  placeholder="Max Value"
                  value={filters.maxValue}
                  onChange={(e) => setFilters(f => ({ ...f, maxValue: e.target.value }))}
                  className="w-full border px-3 py-2 rounded mt-2"
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

      {/* Multiple Graphs */}
      {filters.sensorIds.length === 0 ? (
        <p className="text-gray-500">No sensors selected.</p>
      ) : (
        <div className={`grid gap-6 ${tileView ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
          {filters.sensorIds.map(sensorId => {
            const data = getFilteredReadingsBySensor(sensorId);
            const sensor = sensors.find(s => s.SensorId === parseInt(sensorId));
            const unit = sensor ? SENSOR_UNITS[sensor.Type] || sensor.Type : '';

            return (
              <div key={sensorId} className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold mb-2">{sensor?.Name} ({unit})</h2>
                {data.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={data.map(r => ({
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
                ) : (
                  <p className="text-gray-500">No data found for this sensor.</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default History;
