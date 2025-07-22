import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const PredictionContext = createContext();

export const PredictionProvider = ({ children }) => {
  const [prediction, setPrediction] = useState(null);

  const classifySpecies = async (base64Image) => {
    try {
      const response = await axios.post('http://localhost:5000/api/classifySpecies', { image: base64Image });
      setPrediction(response.data);
      return response.data;
    } catch (error) {
      console.error('❌ classifySpecies error:', error);
      const result = { error: 'Species prediction failed' };
      setPrediction(result);
      return result;
    }
  };

  const classifyHealth = async (base64Image) => {
    try {
      const response = await axios.post('http://localhost:5000/api/classifyHealth', { image: base64Image });
      setPrediction(response.data);
      return response.data;
    } catch (error) {
      console.error('❌ classifyHealth error:', error);
      const result = { error: 'Health prediction failed' };
      setPrediction(result);
      return result;
    }
  };

  return (
    <PredictionContext.Provider value={{ prediction, setPrediction, classifySpecies, classifyHealth }}>
      {children}
    </PredictionContext.Provider>
  );
};

export const usePrediction = () => useContext(PredictionContext);
