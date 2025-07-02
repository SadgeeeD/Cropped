import React from 'react';
import { IoMdClose } from 'react-icons/io';
import '../css/AlertBubble.css'; // Create this CSS for styling

const AlertBubble = ({ alerts, onClose }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="alert-bubble fixed top-20 right-6 z-50 max-w-md bg-white dark:bg-[#2c2c2c] shadow-lg rounded-lg border border-red-400 dark:border-red-600 p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-md font-semibold text-red-700 dark:text-red-300">Alerts</h2>
        <button onClick={onClose} className="text-red-600 hover:text-red-800 text-lg">
          <IoMdClose />
        </button>
      </div>
      <ul className="space-y-2 max-h-60 overflow-y-auto">
        {alerts.map((alert, idx) => (
          <li key={idx} className="text-sm text-gray-800 dark:text-gray-200">
            <strong>{alert.sensorName}:</strong> {alert.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlertBubble;
