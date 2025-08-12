import React from 'react';
import './WeatherCard.css';

const WeatherCard = ({ city, country, temp, minTemp, maxTemp, description, pressure, humidity, visibility, wind, sunrise, sunset, color, icon }) => {
  return (
    <div className={`weather-card ${color}`}> 
      <div className="weather-card-header">
        <div>
          <h2>{city}, {country}</h2>
          <span className="weather-date">{new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit' })}, {new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
        </div>
        <button className="close-btn" aria-label="close">×</button>
      </div>
      <div className="weather-main">
        <div className="weather-icon-desc">
          <span className="weather-icon">{icon}</span>
          <span className="weather-desc">{description}</span>
        </div>
        <div className="weather-temp">
          <span className="temp">{Math.round(temp)}°C</span>
          <div className="temp-range">
            <span>Temp Min: {Math.round(minTemp)}°c</span>
            <span>Temp Max: {Math.round(maxTemp)}°c</span>
          </div>
        </div>
      </div>
      <div className="weather-details">
        <div><b>Pressure:</b> {pressure}hPa</div>
        <div><b>Humidity:</b> {humidity}%</div>
        <div><b>Visibility:</b> {visibility / 1000}km</div>
        <div><b>Wind:</b> {wind.speed}m/s {wind.deg} Degree</div>
        <div><b>Sunrise:</b> {sunrise}</div>
        <div><b>Sunset:</b> {sunset}</div>
      </div>
    </div>
  );
};

export default WeatherCard;