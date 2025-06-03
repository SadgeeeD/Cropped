import React, { useEffect } from 'react'
import { AiOutlineMenu } from "react-icons/ai";
import { RiNotification3Line } from 'react-icons/ri'
import { MdKeyboardArrowDown } from "react-icons/md";
import { Tooltip } from 'react-tooltip';

import avatar from "../data/avatar.jpg"
import { Notification, UserProfile} from '.'
import {useStateContext} from '../contexts/ContextProvider';

const NavButton = ({ title, customFunc, icon, color, dotColor}) => 
  (
    <Tooltip id="tooltip-id" place="bottom" content="Menu">
    <button
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      {icon}
      {dotColor && (
        <span
          style={{ background: dotColor }}
          className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
        />
      )}
    </button>
  </Tooltip>
  )

const Navbar = () => {

  const { activeMenu, setActiveMenu, isClicked, setIsClicked, handleClick } = useStateContext();
   return (
    <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative">

      <NavButton title="Menu" customFunc= {() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)} color={"green"} icon={<AiOutlineMenu />} />
      <div className="flex">
        <NavButton title="Notification" dotColor="rgb(254, 201, 15)" customFunc={() => handleClick('notification')} color={ "green "} icon={<RiNotification3Line />} />
        <Tooltip id="Profile" position="bottom">
          <div
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
            onClick={() => handleClick('userProfile')}
          >
            <img
              className="rounded-full w-8 h-8"
              src={avatar}
              alt="user-profile"
            />
            <p>
              <span className="text-gray-400 text-14">Hi,</span>{' '}
              <span className="text-gray-400 font-bold ml-1 text-14">
                Michael
              </span>
            </p>
            <MdKeyboardArrowDown className="text-gray-400 text-14" />
          </div>
        </Tooltip>

        {isClicked.notification && (<Notification />)}
        {isClicked.userProfile && (<UserProfile />)}
      </div>
    </div>
  );
};

export default Navbar