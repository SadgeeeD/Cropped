import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SiShopware } from 'react-icons/si';
import { MdOutlineCancel } from 'react-icons/md';
import { Tooltip } from 'react-tooltip';

import { links } from '../data/Links';
import { useStateContext } from '../contexts/ContextProvider';

const Sidebar = () => {
  const { activeMenu, setActiveMenu, screenSize } = useStateContext();

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink =
    'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-white bg-green-500 m-2';

  const normalLink =
    'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] m-2 transition';

  return (
    <div className="h-screen overflow-y-auto pb-10 bg-white dark:bg-[#1f1f1f] border-r border-gray-200 dark:border-gray-700 transition-colors duration-300">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link
              to="/Home"
              onClick={() => setActiveMenu(false)}
              className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight text-gray-900 dark:text-white"
            >
              <SiShopware /> <span>Cropped</span>
            </Link>
            <button
              type="button"
              onClick={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)}
              className="text-xl rounded-full p-3 hover:bg-gray-200 dark:hover:bg-[#2f2f2f] mt-4"
              data-tooltip-id="menu-tooltip"
              data-tooltip-content="Close Menu"
              data-tooltip-place="bottom"
            >
              <MdOutlineCancel className="text-gray-800 dark:text-white" />
            </button>
            <Tooltip id="menu-tooltip" />
          </div>

          <div className="mt-10">
            {links.map((item) => (
              <div key={item.title}>
                <p className="text-gray-500 dark:text-gray-400 m-3 mt-4 uppercase text-xs tracking-wider">
                  {item.title}
                </p>
                {item.links.map((link) => (
                  <NavLink
                    to={`/${link.name}`}
                    key={link.name}
                    onClick={handleCloseSideBar}
                    className={({ isActive }) =>
                      isActive ? activeLink : normalLink
                    }
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span className="capitalize">{link.name}</span>
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
