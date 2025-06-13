import React, { useState } from 'react';

function HistoryFilter({ sensors, farms, onApplyFilters, onResetFilters }) {
  const [selectedSensorId, setSelectedSensorId] = useState('');
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [selectedSensorType, setSelectedSensorType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');

  const sensorTypes = [...new Set(sensors.map(s => s.Type))];

  const handleApply = () => {
    onApplyFilters({
      sensorId: selectedSensorId,
      farmId: selectedFarmId,
      sensorType: selectedSensorType,
      startDate,
      endDate,
      minValue,
      maxValue
    });
  };

  const handleReset = () => {
    setSelectedSensorId('');
    setSelectedFarmId('');
    setSelectedSensorType('');
    setStartDate('');
    setEndDate('');
    setMinValue('');
    setMaxValue('');
    onResetFilters();
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <select className="border px-3 py-2 rounded" value={selectedSensorId} onChange={e => setSelectedSensorId(e.target.value)}>
        <option value="">Sensor</option>
        {sensors.map(s => (
          <option key={s.SensorId} value={s.SensorId}>{s.Name}</option>
        ))}
      </select>

      <select className="border px-3 py-2 rounded" value={selectedSensorType} onChange={e => setSelectedSensorType(e.target.value)}>
        <option value="">Sensor Type</option>
        {sensorTypes.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      <select className="border px-3 py-2 rounded" value={selectedFarmId} onChange={e => setSelectedFarmId(e.target.value)}>
        <option value="">Farm</option>
        {farms.map(f => (
          <option key={f.FarmId} value={f.FarmId}>{f.Name || `Farm ${f.FarmId}`}</option>
        ))}
      </select>

      <input type="date" className="border px-3 py-2 rounded" value={startDate} onChange={e => setStartDate(e.target.value)} />
      <input type="date" className="border px-3 py-2 rounded" value={endDate} onChange={e => setEndDate(e.target.value)} />

      <div className="flex gap-2">
        <input type="number" placeholder="Min Value" className="border px-3 py-2 rounded w-1/2" value={minValue} onChange={e => setMinValue(e.target.value)} />
        <input type="number" placeholder="Max Value" className="border px-3 py-2 rounded w-1/2" value={maxValue} onChange={e => setMaxValue(e.target.value)} />
      </div>

      <div className="flex gap-2 col-span-full justify-end mt-2">
        <button onClick={handleReset} className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">Reset Filters</button>
        <button onClick={handleApply} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Apply Filters</button>
      </div>
    </div>
  );
}

export default HistoryFilter;
