// src/contexts/ContextProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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

  // Notification-specific state
  const [notifications, setNotifications] = useState([]);
  const [alertsEnabled, setAlertsEnabled] = useState(() => {
    const saved = localStorage.getItem('alertsEnabled');
    return saved === null ? true : JSON.parse(saved);
  });

  const THRESHOLDS = {
    'pH': { min: 6.5, max: 7.5 },
    'EC/TDS': { min: 500, max: 2000 },
    'water_temperature': { min: 20, max: 30 },
    'dissolved_oxygen': { min: 5, max: 8 },
    'chlorophyll': { min: 5, max: 15 },
    'ammonia': { min: 0, max: 8.0 },
    'nitrite': { min: 0, max: 0.1 },
    'nitrate': { min: 0, max: 40 },
  };

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const [sensorsResponse, sensorReadingsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/getSensors'),
          axios.get('http://localhost:5000/api/getSensorReadings')
        ]);

        const sensors = sensorsResponse.data;
        const readings = sensorReadingsResponse.data;

        const alerts = [];

        for (const reading of readings) {
          const sensor = sensors.find(s => s.SensorId === reading.SensorId);
          if (!sensor) continue;

          const type = sensor.Type;
          const thresholds = THRESHOLDS[type];

          if (thresholds) {
            if (reading.Value < thresholds.min) {
              alerts.push({
                sensorName: sensor.Name,
                message: `${type} too low: ${reading.Value}`,
                severity: 'low',
                timestamp: reading.Timestamp,
              });
            } else if (reading.Value > thresholds.max) {
              alerts.push({
                sensorName: sensor.Name,
                message: `${type} too high: ${reading.Value}`,
                severity: 'high',
                timestamp: reading.Timestamp,
              });
            }
          }
        }

        setNotifications(alerts);
      } catch (error) {
        console.error("❌ Notification fetch error:", error);
      }
    };

    fetchSensorData();
  }, []);

  const handleClick = (clicked) => {
    setIsClicked({
      userProfile: false,
      notification: false,
      [clicked]: true,
    });
  };

  useEffect(() => {
    const modeToApply = getEffectiveTheme(currentMode);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(modeToApply);
  }, [currentMode]);

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

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    // Set initial screen size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        notifications,
        alertsEnabled,
        setAlertsEnabled,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
