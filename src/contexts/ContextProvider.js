import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

const initialState = {
    userProfile: false,
    notification: false
}

export const ContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);
  //const [currentColor, setCurrentColor] = useState('#03C9D7');
  // const [currentMode, setCurrentMode] = useState('Light');
  // const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [hasNewAlert, setHasNewAlert] = useState([]);

// const setMode = (e) => {
//     setCurrentMode(e.target.value);
//     localStorage.setItem('themeMode', e.target.value);
//   };

//   const setColor = (color) => {
//     setCurrentColor(color);
//     localStorage.setItem('colorMode', color);
//   };

  const handleClick = (clicked) => setIsClicked({ ...initialState, [clicked]: true });

  const closeAll = () => setIsClicked({ ...initialState });

  const toggleUserProfile = () => {
    setIsUserProfileOpen(prev => !prev);
  }

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StateContext.Provider 
      value={{ activeMenu, setActiveMenu, isClicked, setIsClicked, handleClick, closeAll, screenSize, setScreenSize, isUserProfileOpen, setIsUserProfileOpen, hasNewAlert, setHasNewAlert

      }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);