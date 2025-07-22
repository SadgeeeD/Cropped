import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataProvider';
import { useStateContext } from '../contexts/ContextProvider.js';

const Settings = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const { setCurrentMode, currentMode } = useStateContext();
  const { alertsEnabled, setAlertsEnabled } = useStateContext();

  const handlePasswordChange = async () => {
    setMsg('');
    if (!currentPassword || !newPassword) {
      setMsg('⚠️ Both fields are required.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/changePassword', {
        email: user.email,
        currentPassword,
        newPassword,
      });
      setMsg(res.data.message || '✅ Password changed successfully');
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || '❌ Password change failed');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Password change UI */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Account Settings</h2>
        <div className="space-y-2">
          <p2 className="text-yellow-600">Changing Password does not work as of now.</p2>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="p-2 rounded border w-full dark:bg-[#2a2a2a] dark:border-gray-600"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="p-2 rounded border w-full dark:bg-[#2a2a2a] dark:border-gray-600"
          />
          <button
            onClick={handlePasswordChange}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Change Password
          </button>
          {msg && <p className="text-sm mt-2">{msg}</p>}
        </div>
      </section>

      {/* Appearance */}
      <section className="mb-8 border-t pt-4 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-2">Appearance</h2>
        <div className="mb-2">
          <label className="mr-4 block">
            Theme Mode:
            <select
              value={currentMode}
              onChange={(e) => {
                const newMode = e.target.value;
                setCurrentMode(newMode);
                localStorage.setItem('themeMode', newMode);
              }}
              className="w-full p-2 border rounded mt-1 dark:bg-[#2a2a2a] dark:text-white dark:border-gray-600"
            >
              <option value="system">System Default</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>
        </div>
      </section>

      {/* Notifications */}
      <section className="mb-8 border-t pt-4 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-2">Notifications</h2>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={alertsEnabled}
            onChange={(e) => {
              const enabled = e.target.checked;
              setAlertsEnabled(enabled);
              localStorage.setItem('alertsEnabled', JSON.stringify(enabled));
            }}
            className="h-4 w-4"
          />
          Enable Home Sensor Alerts
        </label>
      </section>

      {/* Data & Privacy */}
      <section className="mb-8 border-t pt-4 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-2">Data & Privacy</h2>
        <button className="text-red-500 underline">Delete Account</button>
      </section>
    </div>
  );
};

export default Settings;
