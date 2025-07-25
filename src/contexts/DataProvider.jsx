// frontend/src/contexts/DataProvider.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const DataContext = createContext();

export const DataListProvider = ({ children }) => {
  const [farms, setFarms] = useState([]);
  const [sensorReadings, setSensorReadings] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [weather, setWeather] = useState([]);
  const [plants, setPlants] = useState([]);
  const [plantSpecies, setPlantSpecies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    const fetchData = async () => {
      try {
        // #region APIs
        const [farmsResponse, sensorsResponse, sensorReadingsResponse, plantsResponse, plantSpeciesResponse, userResponse] = await Promise.all([
          axios.get(`${BASE_URL}/api/getFarms`),
          axios.get(`${BASE_URL}/api/getSensors`),
          axios.get(`${BASE_URL}/api/getSensorReadings`),
          axios.get(`${BASE_URL}/api/getPlants`),
          axios.get(`${BASE_URL}/api/getAllPlantSpecies`),
          axios.get(`${BASE_URL}/api/getUsers`),
        ]);

        setFarms(farmsResponse.data);
        setSensors(sensorsResponse.data);
        setSensorReadings(sensorReadingsResponse.data);
        setPlants(plantsResponse.data);
        setPlantSpecies(plantSpeciesResponse.data);
        setUsers(userResponse.data);

        const weatherResponse = await axios.get(`${BASE_URL}/weather`);
        const rawWeather = weatherResponse.data;

        const index = rawWeather?.hourly?.time?.length - 1;
        const latestWeather = {
          temperature: rawWeather?.hourly?.temperature_2m?.[index],
          humidity: rawWeather?.hourly?.relative_humidity_2m?.[index],
          uvIndex: rawWeather?.hourly?.uv_index?.[index], // assuming UV is light proxy
          windSpeed: rawWeather?.hourly?.wind_speed_10m?.[index],
        };

        setWeather(latestWeather);
        // #endregion
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

 useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        farms,
        sensors,
        sensorReadings,
        plants,
        plantSpecies,
        users,
        loading,
        weather,
        refetchData: fetchData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
