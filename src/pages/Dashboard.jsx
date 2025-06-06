import React, { useState, useEffect } from 'react';
import api from '../services/API'; // Assuming API.js handles calls to your dataService backend
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Pictures
import leaf_icon from "../data/leaf_icon.svg";
import leaf1 from "../data/leaf1.jpg";
import leaf2 from "../data/leaf2.jpg";
import leaf3 from "../data/leaf3.jpg";

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
        }, 30000); // Rotate every 30 seconds

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
            case "Temperature": value = weatherData?.temperature !== undefined ? `${weatherData.temperature}°C` : "N/A"; break;
            case "Humidity": value = weatherData?.humidity !== undefined ? `${weatherData.humidity}%` : "N/A"; break;
            case "Light": value = weatherData?.light !== undefined ? `${weatherData.light} lx` : "N/A"; break;
            case "Wind Speed": value = weatherData?.windSpeed !== undefined ? `${weatherData.windSpeed} km/h` : "N/A"; break;
            default: value = "N/A";
        }
    } else if (displayMode === 'sensor') {
        source = "Sensor Data";
        switch (label) {
            case "Temperature": value = sensorData?.temperature !== undefined ? `${sensorData.temperature}°C` : "N/A"; break;
            case "Humidity": value = sensorData?.humidity !== undefined ? `${sensorData.humidity}%` : "N/A"; break;
            case "Light": value = sensorData?.light !== undefined ? `${sensorData.light} µmol/m²` : "N/A"; break; // Using µmol/m² based on your PDF
            case "Wind / Pressure": value = sensorData?.pressure !== undefined ? `${sensorData.pressure} hPa` : "N/A"; break; // For pressure
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
    const [farms, setFarms] = useState([]);
    const [weather, setWeather] = useState(null);
    const [sensorReadings, setSensorReadings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Farms
                const fetchedFarms = await api.getAllFarms();
                setFarms(fetchedFarms);

                // Fetch Weather (e.g., for Singapore coordinates)
                // You'll need to implement getWeatherData in your API.js to call a weather API (e.g., OpenWeatherMap)
                const fetchedWeather = await api.getWeatherData(1.3521, 103.8198);
                setWeather(fetchedWeather);

                // Fetch all Sensor Readings from your external API via dataService
                const fetchedReadings = await api.getSensorReadings();
                setSensorReadings(fetchedReadings);

            } catch (err) {
                setError(err.message);
                console.error("Failed to fetch data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Derived state for passing to RotatableSummaryCard components
    const weatherDataForCard = weather; // Directly use the fetched weather data

    const latestSensorData = {};
    if (sensorReadings && sensorReadings.length > 0) {
        // Find the latest reading for each unit type based on Timestamp
        const latestReadingsByUnit = {};
        sensorReadings.forEach(reading => {
            if (!latestReadingsByUnit[reading.Unit] || new Date(reading.Timestamp) > new Date(latestReadingsByUnit[reading.Unit].Timestamp)) {
                latestReadingsByUnit[reading.Unit] = reading;
            }
        });

        // Map units to the expected sensorData properties for the cards
        if (latestReadingsByUnit['µmol/m²']) { // Light sensor
            latestSensorData.light = latestReadingsByUnit['µmol/m²'].Value;
        }
        // Add more mappings here if your external API provides other sensor types with distinct units:
        // if (latestReadingsByUnit['°C']) { latestSensorData.temperature = latestReadingsByUnit['°C'].Value; }
        // if (latestReadingsByUnit['%']) { latestSensorData.humidity = latestReadingsByUnit['%'].Value; }
        // if (latestReadingsByUnit['hPa']) { latestSensorData.pressure = latestReadingsByUnit['hPa'].Value; }
        // Note: 'ppm' units (from your PDF) are not directly mapped to Temperature/Humidity/Pressure
        // unless you have a specific rule or SensorId mapping for them.
    }

    // Prepare chart data only if readings are available
    // Using sensorReadings state directly
    const chartData = sensorReadings.length > 0
        ? sensorReadings.slice(0, 20).map(reading => ({
            time: new Date(reading.Timestamp).toLocaleTimeString(),
            value: reading.Value,
        }))
        : [];

    const renderDashboardContent = () => {
        if (loading) { // Use 'loading' state directly
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

        if (error) { // Use 'error' state directly
            return (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                    <strong className="font-bold">Data Error!</strong>
                    <span className="block sm:inline"> {error}</span> {/* Use 'error' state directly */}
                    <p className="mt-2 text-sm">Attempting to display static layout with default values.</p>
                </div>
            );
        }

       // Render actual data when successfully loaded and no error
        return (
            <>
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <RotatableSummaryCard
                        label="Temperature"
                        icon="🌡️"
                        weatherData={weatherDataForCard} // Pass derived data
                        sensorData={latestSensorData} // Pass derived data
                        isLoading={loading}
                    />
                    <RotatableSummaryCard
                        label="Humidity"
                        icon="💧"
                        weatherData={weatherDataForCard} // Pass derived data
                        sensorData={latestSensorData} // Pass derived data
                        isLoading={loading}
                    />
                    <RotatableSummaryCard
                        label="Light"
                        icon="☀️"
                        weatherData={weatherDataForCard} // Pass derived data
                        sensorData={latestSensorData} // Pass derived data
                        isLoading={loading}
                    />
                    <RotatableSummaryCard
                        label="Wind / Pressure"
                        icon="💨"
                        weatherData={weatherDataForCard} // Pass derived data
                        sensorData={latestSensorData} // Pass derived data
                        isLoading={loading}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-semibold mb-2">Sensor Data</h2>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={chartData}> {/* Use chartData */}
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
            </>
        );
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {renderDashboardContent()}
        </div>
    );
}

export default Dashboard;