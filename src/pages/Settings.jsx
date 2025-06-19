import React from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { BsCheck } from 'react-icons/bs';
import { Tooltip } from 'react-tooltip';

import { useStateContext } from '../contexts/ContextProvider.js';

const Settings = () => {
  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
    currentColor,
    setScreenSize,
    screenSize
  } = useStateContext();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Account Settings */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Account Settings</h2>
        <p className="text-gray-600 mb-2">Username: Guest</p>
        <button className="text-blue-500 underline">Change Password</button>
      </section>

      {/* Appearance */}
      <section className="mb-8 border-t pt-4">
        <h2 className="text-xl font-semibold mb-2">Appearance</h2>
        <div className="mb-2">
          <label className="mr-4">
            <select
              value={currentMode}
              onChange={(e) => {
                const newMode = e.target.value;
                setCurrentMode(newMode);
                localStorage.setItem('themeMode', newMode);
              }}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="system">System Default</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>
        </div>
      </section>

      {/* Notifications */}
      <section className="mb-8 border-t pt-4">
        <h2 className="text-xl font-semibold mb-2">Notifications</h2>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="h-4 w-4" />
          Enable Sensor Alerts
        </label>
      </section>

      {/* Data & Privacy */}
      <section className="mb-8 border-t pt-4">
        <h2 className="text-xl font-semibold mb-2">Data & Privacy</h2>
        <button className="text-blue-500 underline mr-4">Export My Data</button>
        <button className="text-red-500 underline">Delete Account</button>
      </section>

      {/* Language & Region */}
      <section className="border-t pt-4">
        <h2 className="text-xl font-semibold mb-2">Language & Region</h2>
        <label className="block mb-2">
          Language:
          <select className="ml-2 border rounded px-2 py-1">
            <option>English</option>
            <option>Chinese</option>
            <option>Malay</option>
            <option>Tamil</option>
          </select>
        </label>
        <label className="block">
          Units:
          <select className="ml-2 border rounded px-2 py-1">
            <option>Metric (°C, cm)</option>
            <option>Imperial (°F, in)</option>
          </select>
        </label>
      </section>
    </div>
  );
};

export default Settings;
