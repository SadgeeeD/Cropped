import React from 'react';
import { Link } from 'react-router-dom'; 
import '../css/Home.css'; 

const Home = () => {
  // You might want to add some logic here to check if a user is logged in
  // For demonstration, we'll assume the dashboard/manual-entry links are always visible,
  // but in a real app, you'd conditionally render login/register or dashboard links.
  const isLoggedIn = false; // Replace with actual authentication check

    return (
    <main className="home-page-container">
      <div className="home-container">
        <h1 className="home-title">Welcome to Cropped!</h1>

        <div className="home-actions">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="home-button primary">Go to Dashboard</Link>
              <Link to="/manual-entry" className="home-button secondary">Enter New Data</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="home-button primary">Log In</Link>
              <Link to="/register" className="home-button secondary">Register</Link>
            </>
          )}
        </div>

        <p className="home-tagline">
          Your insights for clearer waters.
        </p>
      </div>
    </main>
  );
};

export default Home;