  import React from 'react';
  import { Link } from 'react-router-dom';
  import { useAuth } from '../contexts/AuthContext';
  import { useStateContext } from '../contexts/ContextProvider';
  import '../css/Home.css';

  const Home = () => {
    const { user } = useAuth();
    const { notifications, alertsEnabled, screenSize } = useStateContext();
    const isLoggedIn = !!user;
    

    // Show 5 most recent alerts
    const recentAlerts = notifications
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);

    return (
      <main className="home-page-container">
        <div className="home-container">
          <h1 className="home-title">Welcome to Cropped!</h1>

          <div className="home-actions">
            {isLoggedIn ? (
              <>
                <Link to="/Dashboard" className="home-button primary">Go to Dashboard</Link>
                <Link to="/ManualEntry" className="home-button secondary">Enter New Data</Link>
                <Link to="/History" className="home-button tertiary">View Past Records</Link>
                <Link to="/Identifier" className="home-button quaternary">Identify Your Leaves</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="home-button primary">Log In</Link>
                <Link to="/register" className="home-button secondary">Register</Link>
              </>
            )}
          </div>

          <p className="home-tagline">
            {screenSize <= 480
              ? "Optimized for mobile view."
              : screenSize <= 768
              ? "Tablet-friendly insights await."
              : "Your insights for clearer waters."}
          </p>

          {/* Inline Recent Alerts */}
          {alertsEnabled && (
          <section className="mt-8 w-full max-w-5xl">
            <h2 className="text-xl font-semibold mb-4">Urgent Alerts (Past 2 Weeks)</h2>

            {notifications.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-300 text-sm">No issues detected.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {notifications
                  .filter(n => {
                    const now = Date.now();
                    const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000;
                    return new Date(n.timestamp).getTime() >= twoWeeksAgo;
                  })
                  .sort((a, b) => {
                    // Sort high severity first, then by latest time
                    const severityOrder = { high: 0, medium: 1, low: 2 };
                    const sA = severityOrder[a.severity] ?? 3;
                    const sB = severityOrder[b.severity] ?? 3;
                    if (sA !== sB) return sA - sB;
                    return new Date(b.timestamp) - new Date(a.timestamp);
                  })
                  .slice(0, 6)
                  .map((n, index) => (
                    <div
                      key={index}
                      className={`border-l-4 pl-3 py-2 rounded shadow-sm ${
                        n.severity === 'high'
                          ? 'border-red-500 bg-red-50 text-red-800 dark:bg-red-900/30'
                          : 'border-yellow-400 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30'
                      }`}
                    >
                      <div className="text-sm font-semibold">{n.sensorName}</div>
                      <div className="text-xs">{n.message}</div>
                      <div className="text-[10px] text-gray-500">{new Date(n.timestamp).toLocaleString()}</div>
                    </div>
                  ))}
              </div>
            )}
          </section>
          )}
        </div>
      </main>
    );
  };

  export default Home;
