// src/components/Notification.jsx
import React from 'react';
import { useStateContext } from '../contexts/ContextProvider';

const Notification = () => {
  const { notifications } = useStateContext();

  return (
    <div className="nav-item absolute right-5 top-16 bg-white dark:bg-[#42464D] p-6 rounded-lg w-96 z-50 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Alerts</p>
      </div>
      {notifications.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300 text-sm">No issues detected.</p>
      ) : (
        <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {notifications.map((n, index) => (
            <li
              key={index}
              className={`border-l-4 pl-3 py-2 ${
                n.severity === 'high'
                  ? 'border-red-500 bg-red-50 text-red-800 dark:bg-red-900/30'
                  : 'border-yellow-400 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30'
              } rounded`}
            >
              <div className="text-sm font-semibold">{n.sensorName}</div>
              <div className="text-xs">{n.message}</div>
              <div className="text-[10px] text-gray-500">{new Date(n.timestamp).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;
