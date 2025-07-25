import React , { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import 'react-tooltip/dist/react-tooltip.css';

import { Navbar , Sidebar } from './components';
import { Home, Dashboard, Identifier, ManualEntry, History, Login, Register, ProfilePage, Settings} from './pages';

import { DataListProvider } from './contexts/DataProvider';
import { PredictionProvider } from './contexts/PredictionProvider';
import { useStateContext } from './contexts/ContextProvider';
import AlertBubble from './components/AlertBubble';


import './App.css'

const App = () => {
  const { activeMenu, currentMode } = useStateContext();
  const { notifications } = useStateContext();
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
              <Route path="/Dashboard" element = {
                <DataListProvider>
                  <Dashboard />
                </DataListProvider>
              } />
              <Route path="/ManualEntry" element = {
                <DataListProvider>
                  <ManualEntry />
                </DataListProvider> } />
              <Route path="/History" element = {
                <DataListProvider>
                  <History />
                </DataListProvider>} />
              <Route path="/Identifier" element = {
                <PredictionProvider>
                  <Identifier />
                </PredictionProvider>
              } />
              <Route path="/Login" element = {<Login /> } />
              <Route path="/Register" element = {<Register /> } />
              <Route path="/Profile" element={
                <DataListProvider>
                  <ProfilePage />
                </DataListProvider>
              } />
              <Route path="/Settings" element={<Settings />} />
            </Routes>
          </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App