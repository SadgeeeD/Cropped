import React , { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { FiSettings } from 'react-icons/fi'
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

import { Navbar , Sidebar } from './components';
import { Home, Dashboard, Identifier, ManualEntry, History, Login, Register, ProfilePage, Settings} from './pages';

import {useStateContext} from './contexts/ContextProvider';


import './App.css'

const App = () => {
  const { activeMenu, currentMode, setCurrentMode } = useStateContext();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (currentMode === 'system') {
        const newMode = mediaQuery.matches ? 'dark' : 'light';
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newMode);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [currentMode]);


  return (
    <div>
      
    <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          <div className="fixed right-4 bottom-4" style={{ zIndex: 1000 }}>
            <button
              type="button"
              className="text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white"
              style={{ background: 'green', borderRadius: '50%' }}
              data-tooltip-id="settings-tooltip"
              data-tooltip-content="Settings"
              data-tooltip-place="top"
            >
              <FiSettings />
            </button>
            <Tooltip id="settings-tooltip" />
          </div>
          {activeMenu ? (
            <div className="w-72 fixed sidebar dark
            dark:bg-secondary-dark-bg 
            bg-white">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 
            dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}
          <div
            className={
              activeMenu
                ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  '
                : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '
          }>
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
              <Navbar />
            </div>
          

          <div>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/Home" element = {<Home /> } />
              <Route path="/Dashboard" element = {<Dashboard /> } />
              <Route path="/ManualEntry" element = {<ManualEntry /> } />
              <Route path="/History" element = {<History /> } />
              <Route path="/Identifier" element = {<Identifier /> } />
              <Route path="/Login" element = {<Login /> } />
              <Route path="/Register" element = {<Register /> } />
              <Route path="/Profile" element={<ProfilePage />} />
              <Route path="/Settings" element={<Settings />} />
              {/* <Route path="/Help" element={<Help />} /> */}
            </Routes>
          </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App