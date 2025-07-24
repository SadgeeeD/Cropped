import React, { useState } from 'react';
import avatar from '../data/Guest_Avatar.jpg';
import { useData } from '../contexts/DataProvider';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { farms = [] } = useData() || {};
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth(); // ✅ include updateUser
  const [preview, setPreview] = useState(user?.image || avatar);

  const isGuest = !user;
  const displayUser = user || {
    username: 'Guest',
    email: 'guest@example.com',
    role: 'Guest',
    image: null,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    email: displayUser.email,
    image: displayUser.image,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // show preview
        setEditedUser((prev) => ({ ...prev, image: reader.result })); // ✅ set new image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateUser({
      image: editedUser.image,
      email: editedUser.email,
    });
    setIsEditing(false);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white dark:bg-[#2c2c2c] rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Account Settings</h2>

      <div className="flex items-center gap-6 mb-6 border-b pb-6">
        <div className="relative w-24 h-24">
          <img
            src={editedUser.image || displayUser.image || avatar}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover"
          />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute top-0 left-0 w-24 h-24 opacity-0 cursor-pointer"
              title="Change profile picture"
            />
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {displayUser.username}
          </h3>
          {isEditing ? (
            <input
              name="email"
              value={editedUser.email}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#3a3a3a] text-gray-800 dark:text-white p-2 rounded block w-full mt-2"
            />
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">{displayUser.email}</p>
          )}
          <p className="text-xs text-gray-400 italic">{displayUser.role}</p>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Accessible Farms</label>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-200">
          {farms.length > 0 ? (
            farms.map((farm) => <li key={farm.FarmId}>{farm.Name}</li>)
          ) : (
            <li className="italic text-gray-400">No farms available</li>
          )}
        </ul>
      </div>

      <div className="flex gap-4">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded">
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
            Edit Profile
          </button>
        )}

        {isGuest ? (
          <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-4 py-2 rounded">
            Login
          </button>
        ) : (
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        )}

        <button className="bg-red-600 text-white px-4 py-2 rounded ml-auto">Delete Account</button>
      </div>
    </div>
  );
};

export default ProfilePage;
