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

  const inputClass = "border px-3 py-2 rounded bg-white dark:bg-[#3a3a3a] dark:text-white dark:border-gray-600";

  return (
    <div className="bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <select className={inputClass} value={selectedSensorId} onChange={e => setSelectedSensorId(e.target.value)}>
        <option value="">Sensor</option>
        {sensors.map(s => (
          <option key={s.SensorId} value={s.SensorId}>{s.Name}</option>
        ))}
      </select>

      <select className={inputClass} value={selectedSensorType} onChange={e => setSelectedSensorType(e.target.value)}>
        <option value="">Sensor Type</option>
        {sensorTypes.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      <select className={inputClass} value={selectedFarmId} onChange={e => setSelectedFarmId(e.target.value)}>
        <option value="">Farm</option>
        {farms.map(f => (
          <option key={f.FarmId} value={f.FarmId}>{f.Name || `Farm ${f.FarmId}`}</option>
        ))}
      </select>

      <input
        type="date"
        className={inputClass}
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
      />
      <input
        type="date"
        className={inputClass}
        value={endDate}
        onChange={e => setEndDate(e.target.value)}
      />

      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Min Value"
          className={`${inputClass} w-1/2`}
          value={minValue}
          onChange={e => setMinValue(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Value"
          className={`${inputClass} w-1/2`}
          value={maxValue}
          onChange={e => setMaxValue(e.target.value)}
        />
      </div>

      <div className="flex gap-2 col-span-full justify-end mt-2">
        <button
          onClick={handleReset}
          className="bg-gray-200 dark:bg-[#444] text-gray-700 dark:text-white px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-[#555]"
        >
          Reset Filters
        </button>
        <button
          onClick={handleApply}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

export default HistoryFilter;
