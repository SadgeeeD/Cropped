// frontend/src/components/FarmList.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const DataContext = createContext();

export const DataListProvider = ({ children }) => {
  const [farms, setFarms] = useState([]);
  const [sensorReadings, setSensorReadings] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [farmsResponse, sensorsResponse, sensorReadingsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/getFarms'),
          axios.get('http://localhost:5000/api/getSensors'),
          axios.get('http://localhost:5000/api/getSensorReadings'),
        ]);

        setFarms(farmsResponse.data);
        setSensors(sensorsResponse.data);
        setSensorReadings(sensorReadingsResponse.data);

        const weatherResponse = await axios.get('http://localhost:5000/weather');
        const rawWeather = weatherResponse.data;

        const index = rawWeather?.hourly?.time?.length - 1;
        const latestWeather = {
          temperature: rawWeather?.hourly?.temperature_2m?.[index],
          humidity: rawWeather?.hourly?.relative_humidity_2m?.[index],
          light: rawWeather?.hourly?.uv_index?.[index], // assuming UV is light proxy
          windSpeed: rawWeather?.hourly?.wind_speed_10m?.[index],
        };

        setWeather(latestWeather);

      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{farms, sensorReadings, loading , weather, sensors}}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
