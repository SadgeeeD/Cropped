import React , { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

import { Navbar , Sidebar } from './components';
import { Home, Dashboard, Identifier, ManualEntry, History, Login, Register, ProfilePage, Settings} from './pages';

import { useStateContext } from './contexts/ContextProvider';
import { useData } from './contexts/DataProvider';
import AlertBubble from './components/AlertBubble';


import './App.css'

const App = () => {
  const { activeMenu, currentMode } = useStateContext();
  const { notifications } = useData();
  const [showBubble, setShowBubble] = useState(true);

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

  const outOfRangeOrOfflineAlerts = notifications.filter(
    (n) =>
      (n.type === 'out_of_range' || n.type === 'offline') &&
      n.enabled !== false
  );

  return (
    <div>
      
    <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
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
              {/* AlertBubble shows just below Navbar */}
              {showBubble && outOfRangeOrOfflineAlerts.length > 0 && (
                <AlertBubble
                  alerts={outOfRangeOrOfflineAlerts}
                  onClose={() => setShowBubble(false)}
                />
              )}
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