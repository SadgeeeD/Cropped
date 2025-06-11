// frontend/src/components/FarmList.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const DataContext = createContext();


export const DataListProvider = ({ children }) => {
  const [farms, setFarms] = useState([]);
  const [sensorReadings, setSensorReadings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [farmsResponse, sensorResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/getFarms'),
          axios.get('http://localhost:5000/api/getSensorReadings'), // 🔁 Make sure this endpoint exists in your backend
        ]);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{farms, sensorReadings, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
