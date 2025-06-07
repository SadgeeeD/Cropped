import React from 'react';
import { MdPerson, MdSettings, MdHelp } from 'react-icons/md';
import { useStateContext } from '../contexts/ContextProvider';
import avatar from '../data/avatar.jpg';

const UserProfile = () => {
  const { currentColor, closeAll } = useStateContext();

  const user = null; // replace with actual user auth check

  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96 z-50 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        {user ? (
          <button
            onClick={closeAll}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            Close
          </button>
        ) : (
          <a
            href="/login"
            className="text-sm text-blue-500 hover:underline"
            onClick={closeAll}
          >
            Login / Register
          </a>
        )}
      </div>

      <div className="flex gap-5 items-center border-b pb-4">
        <img src={avatar} alt="user" className="rounded-full w-16 h-16" />
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-200">Guest</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">No account</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div className="flex items-center gap-4 cursor-pointer">
          <MdPerson className="text-xl" />
          <p className="text-md">Profile</p>
        </div>
        <div className="flex items-center gap-4 cursor-pointer">
          <MdSettings className="text-xl" />
          <p className="text-md">Settings</p>
        </div>
        <div className="flex items-center gap-4 cursor-pointer">
          <MdHelp className="text-xl" />
          <p className="text-md">Help</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
