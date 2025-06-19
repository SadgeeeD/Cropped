// src/pages/ProfilePage.jsx
import React, { useState } from 'react';
import avatar from '../data/avatar.jpg';

import { useStateContext } from '../contexts/ContextProvider';


const ProfilePage = () => {
  const user = {
    name: 'Kira',
    email: 'guest@example.com',
    role: 'Admin',
  };

  const { currentMode, setCurrentMode } = useStateContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // TODO: send to backend
    console.log('Saved user:', editedUser);
    setIsEditing(false);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white dark:bg-[#2c2c2c] rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Account Settings</h2>

      <div className="flex items-center gap-6 mb-6 border-b pb-6">
        <img src={avatar} alt="avatar" className="w-24 h-24 rounded-full" />
        <div>
          {isEditing ? (
            <>
              <input
                name="name"
                value={editedUser.name}
                onChange={handleChange}
                className="border p-2 rounded mb-2 block w-full"
              />
              <input
                name="email"
                value={editedUser.email}
                onChange={handleChange}
                className="border p-2 rounded block w-full"
              />
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{user.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              <p className="text-xs text-gray-400 italic">{user.role}</p>
            </>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300">Theme</label>
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
        </div>

        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300">Notifications</label>
          <div className="mt-1">
            <label className="inline-flex items-center mr-4">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Email</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">SMS</span>
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded">Cancel</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Edit Profile</button>
          )}
          <button className="bg-blue-600 text-white px-4 py-2 rounded ml-auto">Log Out</button>
          <button className="bg-red-600 text-white px-4 py-2 rounded ml-auto">Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
