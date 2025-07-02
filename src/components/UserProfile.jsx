import React from 'react';
import { MdPerson, MdSettings, MdHelp } from 'react-icons/md';
import { useStateContext } from '../contexts/ContextProvider';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import avatar from '../data/Guest_Avatar.jpg';

const UserProfile = () => {
  const { currentColor } = useStateContext();
  const { user, logout } = useAuth();

  const displayName = user?.Name || user?.username || 'Guest';
  const displayEmail = user?.Email || user?.email || 'No account';

  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96 z-50 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        {user ? (
          <button
            className="text-sm text-red-500 hover:underline"
            onClick={logout}
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="text-sm text-blue-500 hover:underline"
          >
            Login / Register
          </Link>
        )}
      </div>

      <div className="flex gap-5 items-center border-b pb-4">
        <img
          src={user?.image || avatar}
          alt="user"
          className="rounded-full w-16 h-16 object-cover"
        />
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-200">
            {displayName}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {displayEmail}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <Link to="/profile" className="flex items-center gap-4 cursor-pointer hover:underline">
          <MdPerson className="text-xl" />
          <p className="text-md">Profile</p>
        </Link>
        <Link to="/settings" className="flex items-center gap-4 cursor-pointer hover:underline">
          <MdSettings className="text-xl" />
          <p className="text-md">Settings</p>
        </Link>
      </div>
    </div>
  );
};

export default UserProfile;
