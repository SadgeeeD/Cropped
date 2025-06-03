import React, { useEffect } from 'react';
import { AiOutlineMenu } from "react-icons/ai";
import { RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from "react-icons/md";
import { Tooltip } from 'react-tooltip'; // Assuming you have react-tooltip installed

import { useRef } from 'react'; // ADD THIS LINE
import debounce from 'lodash.debounce'; // ADD THIS LINE

import avatar from "../data/avatar.jpg";
import { Notification, UserProfile } from '.'; // Assuming these are components you want to render
import { useStateContext } from '../contexts/ContextProvider';

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <>
    {/* Use data-tooltip-content instead of Tooltip component for direct tooltip */}
    <button
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative text-2xl rounded-full p-3 hover:bg-light-gray bg-white"
      data-tooltip-id="my-tooltip" // Assign a common ID for all tooltips
      data-tooltip-content={title} // Use data-tooltip-content for the title
    >
      {icon}
      {dotColor && (
        <span
          style={{ background: dotColor }}
          className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
        />
      )}
    </button>
  </>
);

const Navbar = () => {
  const {
    activeMenu, setActiveMenu,
    isClicked, handleClick,
    screenSize, setScreenSize // Make sure setScreenSize is available from context
  } = useStateContext();

  const debouncedSetScreenSize = useRef(
    debounce((width) => {
      setScreenSize(width);
    }, 200) // Debounce by 200ms. Adjust this delay as needed.
  ).current;

  useEffect(() => {
    // CHANGE THIS LINE
    const handleResize = () => {
      debouncedSetScreenSize(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // CHANGE THIS LINE
    setScreenSize(window.innerWidth); // Call setScreenSize immediately on mount

    return () => {
      window.removeEventListener('resize', handleResize);
      debouncedSetScreenSize.cancel(); // ADD THIS LINE for cleanup
    };
  }, [setScreenSize, debouncedSetScreenSize]);

  useEffect(() => {
    // This will now correctly react to screenSize changes
    if (screenSize !== undefined) { // Add a check to ensure screenSize is not undefined on initial render
      if (screenSize <= 900) {
        setActiveMenu(false);
      } else {
        setActiveMenu(true);
      }
    }
  }, [screenSize, setActiveMenu]); // Add setActiveMenu to dependencies

  return (
    <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative bg-white">
      <NavButton
        title="Menu"
        customFunc={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)}
        color="black"
        icon={<AiOutlineMenu />}
      />
      <div className="flex">
        <NavButton
          title="Notification"
          dotColor="rgb(254, 201, 15)"
          customFunc={() => handleClick('notification')}
          color="black"
          icon={<RiNotification3Line />}
        />

        {/* Use a single Tooltip component from react-tooltip with a shared ID */}
        <Tooltip id="my-tooltip" />

        <div
          className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
          onClick={() => handleClick('userProfile')}
          data-tooltip-id="my-tooltip" // Use the same ID
          data-tooltip-content="User Profile" // Content for this specific element
        >
          <img
            className="rounded-full w-8 h-8"
            src={avatar}
            alt="user-profile"
          />
          <p>
            <span className="text-gray-400 text-sm">Hi,</span>{' '}
            <span className="text-gray-400 font-bold ml-1 text-sm">
              Kira
            </span>
          </p>
          <MdKeyboardArrowDown className="text-gray-400 text-sm" />
        </div>

        {isClicked.notification && <Notification />}
        {isClicked.userProfile && <UserProfile />}
      </div>
    </div>
  );
};

export default Navbar;