    // services/API.js
    import axios from 'axios';

    // Create an instance of axios
    const api = axios.create({
        baseURL: process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:5000/data', // Adjust this to your backend URL
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Request Interceptor: Add the JWT to the Authorization header for every request
    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('jwtToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log('[FRONTEND API] JWT token added to request header.'); // Add this
            } else {
                console.log('[FRONTEND API] No JWT token found in localStorage.'); // Add this
            }
        return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // --- Auth related endpoints ---
const login = async (username, password) => {
    try {
        console.log('[FRONTEND API] Attempting login...'); // Add this
        const response = await api.post('/auth/login', { username, password });
        console.log('[FRONTEND API] Login successful, response data:', response.data); // Add this
        if (response.data.token) {
            localStorage.setItem('jwtToken', response.data.token);
            console.log('[FRONTEND API] JWT token stored in localStorage.'); // Add this
        }
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

    const register = async (username, email, password, role) => {
        try {
            const response = await api.post('/auth/register', { username, email, password, role });
            return response.data;
        } catch (error) {
            console.error('Registration error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    // --- Data related endpoints (mapping to your dataController) ---
    const getAllFarms = async () => {
        const response = await api.get('/Farms/GetAllFarms');
        return response.data;
    };

    const getAllPlants = async () => {
        const response = await api.get('/data/plants');
        return response.data;
    };

    const getAllSensors = async () => {
        const response = await api.get('/data/sensors');
        return response.data;
    };

    const getSensorById = async (sensorId) => {
        const response = await api.get(`/data/sensors/${sensorId}`);
        return response.data;
    };

    // Sensor Readings from External API
    const getSensorReadings = async () => {
        const response = await api.get('/data/readings');
        return response.data;
    };

    const getSensorReadingsBySensorId = async (sensorId) => {
        const response = await api.get(`/data/readings/sensor/${sensorId}`);
        return response.data;
    };

    const getLatestSensorReadingBySensorId = async (sensorId) => {
        const response = await api.get(`/data/readings/latest/${sensorId}`);
        return response.data;
    };

    const getSensorReadingsByPlantId = async (plantId) => {
        const response = await api.get(`/data/readings/plant/${plantId}`);
        return response.data;
    };

    const createSensorReading = async (readingData) => {
        const response = await api.post('/data/readings', readingData);
        return response.data;
    };

    const fetchAndSaveExternalSensorReadings = async () => {
        const response = await api.post('/data/readings/fetch-and-save-external');
        return response.data;
    };

    // --- Weather Data (Placeholder - You'll need to integrate a real weather API here) ---
    const getWeatherData = async (lat, lon) => {
        // This is a placeholder. In a real application, you would:
        // 1. Call your own backend endpoint that acts as a proxy to a weather API (e.g., OpenWeatherMap).
        //    Your backend would handle the API key for the weather service.
        // 2. Or, if the weather API is public and allows client-side calls, directly call it here.
        //    (But this usually exposes API keys, which is bad practice for restricted APIs).

        console.warn("Weather data is mocked. Implement a real weather API call via your backend.");

        // Example of a mocked response for testing purposes:
        return {
            temperature: 28 + Math.random() * 2, // Realistic temperature for Singapore
            humidity: 80 + Math.random() * 5,
            light: 5000 + Math.random() * 1000,
            windSpeed: 5 + Math.random() * 2,
            // Add more weather relevant data if needed
        };
    };


    export default {
        login,
        register,
        getAllFarms,
        getAllPlants,
        getAllSensors,
        getSensorById,
        getSensorReadings,
        getSensorReadingsBySensorId,
        getLatestSensorReadingBySensorId,
        getSensorReadingsByPlantId,
        createSensorReading,
        fetchAndSaveExternalSensorReadings,
        getWeatherData, // Make sure this is implemented or mocked
    };