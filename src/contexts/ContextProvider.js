// src/contexts/ContextProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const StateContext = createContext();

const getInitialMode = () => {
  return localStorage.getItem('themeMode') || 'system';
};

const getEffectiveTheme = (mode) => {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return mode;
};

export const ContextProvider = ({ children }) => {
  const [currentColor, setCurrentColor] = useState('#03C9D7');
  const [currentMode, setCurrentMode] = useState(getInitialMode());
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState({
    userProfile: false,
    notification: false,
  });
  const [screenSize, setScreenSize] = useState(undefined);

  const handleClick = (clicked) => {
    setIsClicked({
      userProfile: false,
      notification: false,
      [clicked]: true,
    });
  };

  // Apply theme to <html>
  useEffect(() => {
    const modeToApply = getEffectiveTheme(currentMode);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(modeToApply);
  }, [currentMode]);

  // Listen to system preference changes (only if using 'system')
  useEffect(() => {
    if (currentMode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      const newTheme = mediaQuery.matches ? 'dark' : 'light';
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [currentMode]);

  return (
    <StateContext.Provider
      value={{
        currentColor,
        currentMode,
        setCurrentColor,
        setCurrentMode,
        activeMenu,
        setActiveMenu,
        isClicked,
        setIsClicked,
        handleClick,
        screenSize,
        setScreenSize,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
