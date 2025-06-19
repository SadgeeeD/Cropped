import React, { useEffect, useRef } from 'react';
import { AiOutlineMenu } from "react-icons/ai";
import { RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from "react-icons/md";
import { Tooltip } from 'react-tooltip';
import debounce from 'lodash.debounce';

import avatar from "../data/avatar.jpg";
import { Notification, UserProfile } from '.';
import { useStateContext } from '../contexts/ContextProvider';

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <button
    type="button"
    onClick={customFunc}
    style={{ color }}
    className="relative text-2xl rounded-full p-3 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] bg-transparent dark:bg-transparent"
    data-tooltip-id="my-tooltip"
    data-tooltip-content={title}
  >
    {icon}
    {dotColor && (
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
    )}
  </button>
);

const Navbar = () => {
  const {
    activeMenu, setActiveMenu,
    isClicked, handleClick,
    setIsClicked, screenSize, setScreenSize
  } = useStateContext();

  const dropdownRef = useRef(null);

  const debouncedSetScreenSize = useRef(
    debounce((width) => {
      setScreenSize(width);
    }, 200)
  ).current;

  useEffect(() => {
    const handleResize = () => {
      debouncedSetScreenSize(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    setScreenSize(window.innerWidth);

    return () => {
      window.removeEventListener('resize', handleResize);
      debouncedSetScreenSize.cancel();
    };
  }, [setScreenSize, debouncedSetScreenSize]);

  useEffect(() => {
    if (screenSize !== undefined) {
      setActiveMenu(screenSize > 900);
    }
  }, [screenSize, setActiveMenu]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsClicked({
          chat: false,
          cart: false,
          userProfile: false,
          notification: false,
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsClicked]);

  return (
    <div className="flex justify-between p-2 relative bg-white dark:bg-[#1a1a1a] text-black dark:text-white shadow-sm">
      <NavButton
        title="Menu"
        customFunc={() => setActiveMenu((prev) => !prev)}
        color="inherit"
        icon={<AiOutlineMenu />}
      />

      <div className="flex items-center gap-2" ref={dropdownRef}>
        <NavButton
          title="Notification"
          dotColor="rgb(254, 201, 15)"
          customFunc={() => handleClick('notification')}
          color="inherit"
          icon={<RiNotification3Line />}
        />

        <Tooltip id="my-tooltip" />

        <div
          className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
          onClick={() => handleClick('userProfile')}
          data-tooltip-id="my-tooltip"
          data-tooltip-content="User Profile"
        >
          <img
            className="rounded-full w-8 h-8"
            src={avatar}
            alt="user-profile"
          />
          <p className="hidden sm:block">
            <span className="text-gray-600 dark:text-gray-300 text-sm">Hi,</span>{' '}
            <span className="font-semibold text-sm">Kira</span>
          </p>
          <MdKeyboardArrowDown className="text-gray-600 dark:text-gray-300 text-sm" />
        </div>

        {isClicked.notification && <Notification />}
        {isClicked.userProfile && <UserProfile />}
      </div>
    </div>
  );
};

export default Navbar;
