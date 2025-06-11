import React, { useState, useEffect } from 'react';
import api from '../services/API'; // Assuming API.js handles calls to your dataService backend
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Pictures
import leaf_icon from "../data/leaf_icon.svg";
import leaf1 from "../data/leaf1.jpg";
import leaf2 from "../data/leaf2.jpg";
import leaf3 from "../data/leaf3.jpg";


import { DataListProvider } from '../contexts/DataProvider';
import { useData } from '../contexts/DataProvider';

// #region Skeleton Loading
const SkeletonCard = () => (
    <div className="bg-white p-4 rounded shadow flex items-center gap-4 animate-pulse">
        <div className="bg-gray-200 h-10 w-10 rounded-full"></div>
        <div>
            <div className="bg-gray-200 h-4 w-20 mb-2 rounded"></div>
            <div className="bg-gray-300 h-6 w-24 rounded"></div>
        </div>
    </div>
);

const SkeletonChart = () => (
    <div className="bg-white p-4 rounded shadow animate-pulse">
        <div className="bg-gray-200 h-6 w-32 mb-4 rounded"></div> {/* Title placeholder */}
        <div className="bg-gray-200 h-48 w-full rounded"></div> {/* Chart area placeholder */}
    </div>
);

const SkeletonImageGrid = () => (
    <div className="bg-white p-4 rounded shadow animate-pulse">
        <div className="bg-gray-200 h-6 w-24 mb-4 rounded"></div> {/* Title placeholder */}
        <div className="flex justify-center items-center mb-4">
            <div className="bg-gray-200 h-16 w-16 rounded-full"></div> {/* Main icon placeholder */}
        </div>
        <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-200 h-20 w-full rounded"></div> {/* Image placeholder */}
            <div className="bg-gray-200 h-20 w-full rounded"></div> {/* Image placeholder */}
            <div className="bg-gray-200 h-20 w-full rounded"></div> {/* Image placeholder */}
        </div>
    </div>
);

const SkeletonTable = () => (
    <div className="bg-white p-4 rounded shadow animate-pulse">
        <div className="bg-gray-200 h-6 w-28 mb-4 rounded"></div> {/* Title placeholder */}
        <div className="bg-gray-100 h-8 w-full mb-2 rounded"></div> {/* Table header placeholder */}
        <div className="bg-gray-50 h-8 w-full mb-2 rounded"></div> {/* Row 1 placeholder */}
        <div className="bg-gray-100 h-8 w-full mb-2 rounded"></div> {/* Row 2 placeholder */}
        <div className="bg-gray-50 h-8 w-full rounded"></div> {/* Row 3 placeholder */}
    </div>
);
// #endregion

// #region Rotatable Summary Card Component
function RotatableSummaryCard({ label, icon, weatherData, sensorData, isLoading }) {
    const [displayMode, setDisplayMode] = useState('weather'); // 'weather' or 'sensor'

    useEffect(() => {
        const interval = setInterval(() => {
            setDisplayMode(prevMode => (prevMode === 'weather' ? 'sensor' : 'weather'));
        }, 6000); // Rotate every min

        return () => clearInterval(interval); // Clear interval on unmount
    }, []);

    let value = "N/A";
    let source = "";

    const cardClasses = `bg-white p-4 rounded shadow flex items-center gap-4 transition-opacity duration-500 ease-in-out`;

    if (isLoading) {
        return <SkeletonCard />;
    }

    if (displayMode === 'weather') {
        source = "Weather Forecast";
        switch (label) {
            case "Temperature (Air)":
            case "Temperature (Water)": // Weather forecast usually doesn't distinguish, so treat as general
                value = weatherData?.temperature !== undefined ? `${weatherData.temperature}°C` : "N/A";
                break;
            case "Humidity": value = weatherData?.humidity !== undefined ? `${weatherData.humidity}%` : "N/A"; break;
            case "Light": value = weatherData?.light !== undefined ? `${weatherData.light} lx` : "N/A"; break;
            case "Wind Speed": value = weatherData?.windSpeed !== undefined ? `${weatherData.windSpeed} km/h` : "N/A"; break;
            default: value = "N/A";
        }
    } else if (displayMode === 'sensor') {
        source = "Sensor Data";
        switch (label) {
            case "Temperature (Air)":
                value = sensorData?.airTemperature !== undefined
                    ? `${parseFloat(sensorData.airTemperature).toFixed(2)}°C`
                    : "N/A";
                break;

            case "Temperature (Water)":
                value = sensorData?.waterTemperature !== undefined
                    ? `${parseFloat(sensorData.waterTemperature).toFixed(2)}°C`
                    : "N/A";
                break;

            case "Humidity":
                value = sensorData?.humidity !== undefined
                    ? `${parseFloat(sensorData.humidity).toFixed(2)}%`
                    : "N/A";
                break;

            case "Light":
                value = sensorData?.light !== undefined
                    ? `${parseFloat(sensorData.light).toFixed(2)} µmol/m²`
                    : "N/A";
                break;

            case "Wind / Pressure":
                value = sensorData?.pressure !== undefined
                    ? `${parseFloat(sensorData.pressure).toFixed(2)} hPa`
                    : "N/A";
                break;
            case "Farm Location":
                value = sensorData?.farmLocation || "N/A";
                break;

            default: value = "N/A";
        }
    }

    return (
        <div className={cardClasses}>
            <div className="text-2xl">{icon}</div>
            <div>
                <div className="text-gray-600 text-sm">{label}</div>
                <div className="text-lg font-bold">{value}</div>
                <div className="text-xs text-gray-400 mt-1">{source}</div>
            </div>
        </div>
    );

    
}

// #endregion

function Dashboard() {
    
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);

   const { farms, sensorReadings, loading } = useData();


    useEffect(() => {
        const fetchData = async () => {
            try {
                

                // Fetch Weather (e.g., for Singapore coordinates)
                const fetchedWeather = await api.getWeatherData(1.3521, 103.8198);
                setWeather(fetchedWeather);

                // Fetch all Sensor Readings from your external API via dataService
                const fetchedReadings = await api.getSensorReadings();

            } catch (err) {
                setError(err.message);
                console.error("Failed to fetch data:", err);
            } 
        };

        fetchData();
    }, []);

    // Derived state for passing to RotatableSummaryCard components
    const weatherDataForCard = weather; // Directly use the fetched weather data

    const latestSensorData = {};
    if (sensorReadings && sensorReadings.length > 0) {
        // Find the latest reading for each sensor type (identified by SensorId)
        const latestReadingsBySensorId = {};
        sensorReadings.forEach(reading => {
            if (!latestReadingsBySensorId[reading.SensorId] || new Date(reading.Timestamp) > new Date(latestReadingsBySensorId[reading.SensorId].Timestamp)) {
                latestReadingsBySensorId[reading.SensorId] = reading;
            }
        });

        // Map specific SensorIds to the expected sensorData properties for the cards
        // IMPORTANT: You'll need to know the SensorId values for your air and water temperature sensors.
        // For example, let's assume 'temp_air_001' is for air temperature and 'temp_water_001' for water temperature.
        // You would replace these placeholder IDs with your actual SensorIds.

        // Example SensorId mappings (YOU MUST REPLACE THESE WITH YOUR ACTUAL SENSOR IDs)
        if (latestReadingsBySensorId['air_temp_sensor_id_placeholder']) {
            latestSensorData.airTemperature = latestReadingsBySensorId['air_temp_sensor_id_placeholder'].Value;
        }
        if (latestReadingsBySensorId['water_temp_sensor_id_placeholder']) {
            latestSensorData.waterTemperature = latestReadingsBySensorId['water_temp_sensor_id_placeholder'].Value;
        }
        if (latestReadingsBySensorId['light_sensor_id_placeholder']) { // Light sensor (using its SensorId)
            latestSensorData.light = latestReadingsBySensorId['light_sensor_id_placeholder'].Value;
        }
        if (latestReadingsBySensorId['humidity_sensor_id_placeholder']) { // Humidity sensor
            latestSensorData.humidity = latestReadingsBySensorId['humidity_sensor_id_placeholder'].Value;
        }
        if (latestReadingsBySensorId['pressure_sensor_id_placeholder']) { // Pressure sensor
             latestSensorData.pressure = latestReadingsBySensorId['pressure_sensor_id_placeholder'].Value;
        }
        // Add more mappings for other sensor types (e.g., pH, dissolved oxygen, etc.) if needed
    }


    // Prepare chart data only if readings are available
    // For simplicity, let's assume the chart will display data from one of the temperature sensors,
    // for instance, the air temperature sensor. You might need to make this configurable
    // or display multiple lines for different sensors.
    const chartData = sensorReadings.length > 0
        ? sensorReadings
            .filter(reading => reading.SensorId === 'air_temp_sensor_id_placeholder') // Filter for a specific sensor for the chart
            .slice(0, 20) // Take the latest 20 readings for the chart
            .map(reading => ({
                time: new Date(reading.Timestamp).toLocaleTimeString(),
                value: reading.Value,
            }))
        : [];

    const renderDashboardContent = () => {
        if (loading) {
            return (
                <>
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <SkeletonChart />
                        <SkeletonImageGrid />
                    </div>

                    <SkeletonTable />
                </>
            );
        }

        // if (error) {
        //     return (
        //         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
        //             <strong className="font-bold">Data Error!</strong>
        //             <span className="block sm:inline"> {error}</span>
        //             <p className="mt-2 text-sm">Attempting to display static layout with default values.</p>
        //         </div>
        //     );
        // }

        // Render actual data when successfully loaded and no error
        return (
            
            <DataListProvider>
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <RotatableSummaryCard
                        label="Temperature (Air)" // Changed label
                        icon="🌡️"
                        weatherData={weatherDataForCard}
                        sensorData={latestSensorData}
                        isLoading={loading}
                    />
                   
                     <RotatableSummaryCard
                        label="Temperature (Water)" // New card for water temperature
                        icon="🌊" // Water icon
                        weatherData={weatherDataForCard} // Weather API likely gives general temperature
                        sensorData={latestSensorData}
                        isLoading={loading}
                    />
                    <RotatableSummaryCard
                        label="Humidity"
                        icon="💧"
                        weatherData={weatherDataForCard}
                        sensorData={latestSensorData}
                        isLoading={loading}
                    />
                    <RotatableSummaryCard
                        label="Light"
                        icon="☀️"
                        weatherData={weatherDataForCard}
                        sensorData={latestSensorData}
                        isLoading={loading}
                    />
                    <RotatableSummaryCard
                        label="Wind / Pressure"
                        icon="💨"
                        weatherData={weatherDataForCard}
                        sensorData={latestSensorData}
                        isLoading={loading}
                    />
                    <RotatableSummaryCard
                        label="Farm Location"
                        icon="🏡"
                        weatherData={{}} // not needed
                        sensorData={{ farmLocation: farms[0]?.Location }} // ✅ using global context data
                        isLoading={loading}

                    />

                   
                </div>

                
     

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-semibold mb-2">Sensor Data (Air Temperature)</h2> {/* Updated title */}
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={chartData}>
                                <CartesianGrid stroke="#eee" />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#22c55e" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-semibold mb-2">Healthy</h2>
                        <div className="flex justify-center items-center mb-4">
                            <img src={leaf_icon} alt="Healthy Leaf" className="w-16 h-16" />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <img src={leaf1} className="rounded shadow" alt="Leaf 1" />
                            <img src={leaf2} className="rounded shadow" alt="Leaf 2" />
                            <img src={leaf3} className="rounded shadow" alt="Leaf 3" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-2">Plant</h2>
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-2">Plant</th>
                                <th className="text-left p-2">Health</th>
                                <th className="text-left p-2">Growth Stage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: 'Plante', health: 'Healthy', stage: 'Seedling' },
                                { name: 'Bee 3', health: 'Healthy', stage: 'Vegetative' },
                                { name: 'Vegetiaile', health: 'Healthy', stage: 'Seedling' }
                            ].map((plant, index) => (
                                <tr key={index} className="border-b">
                                    <td className="p-2">{plant.name}</td>
                                    <td className="p-2"><span className="bg-green-100 text-green-700 px-2 py-1 rounded">{plant.health}</span></td>
                                    <td className="p-2">{plant.stage}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </DataListProvider>
        );
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {renderDashboardContent()}
        </div>

        
            
        
     
    );
}

export default Dashboard;