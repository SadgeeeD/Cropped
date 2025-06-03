// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 600000, // 10 mins
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
api.interceptors.request.use(config => {
  console.log('Request:', config.url);
  return config;
}, error => {
  return Promise.reject(error);
});


// Add response interceptor
api.interceptors.response.use(response => {
  return response.data;
}, error => {
  console.error('API Error:', error.response?.status, error.message);
  return Promise.reject(error);
});

// API methods
export default {
  getFarms: () => api.get('/Farms/GetAllFarms'),
  getSensorReadings: () => api.get('/SensorReadings/GetAllSensorReadings'),
  getSensors: () => api.get('/Sensors/GetAllSensors'),
  getUsers: () => api.get('/Users/GetAllUsers'),
  
  // Add more methods as needed
};