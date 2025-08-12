import React from 'react';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import Weather from './Weather';

function App() {
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } = useAuth0();

  return (
    <div className="weather-app">
      <header className="weather-header">
        <div className="header-content">
          <div className="logo-section">
            <span role="img" aria-label="weather" className="weather-logo">⛅</span>
            <h1>Weather App</h1>
          </div>
          <div className="auth-section">
            {!isAuthenticated ? (
              <button onClick={() => loginWithRedirect()} className="auth-btn login-btn">
                Log In
              </button>
            ) : (
              <div className="user-info">
                <span className="welcome-text">Welcome, {user?.email}</span>
                <button onClick={() => logout({ returnTo: window.location.origin })} className="auth-btn logout-btn">
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="weather-main">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading authentication...</p>
          </div>
        ) : (
          <Weather />
        )}
      </main>

      <footer className="weather-footer">
        <p>&copy; 2025 Weather App</p>
      </footer>
    </div>
  );
}

export default App;
