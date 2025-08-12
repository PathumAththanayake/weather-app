import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import WeatherCard from './WeatherCard';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const colorMap = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5'];

const iconMap = {
  Clear: '☀️',
  Clouds: '☁️',
  Rain: '🌧️',
  Snow: '❄️',
  Thunderstorm: '⛈️',
  Drizzle: '🌦️',
  Mist: '🌫️',
  Fog: '🌫️',
  Haze: '🌫️'
};

const Weather = () => {
  const { isAuthenticated, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [list, setList] = useState([]);
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    const fetchGroup = async () => {
      if (!isAuthenticated) return;
      setError('');
      setSearchResult(null);
      try {
        setLoading(true);
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE || 'https://weather-api',
            scope: 'read:weather',
          }
        });
        const res = await fetch(`${API_BASE}/weather`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 403) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'You do not have the read:weather scope');
        }
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || `Request failed (${res.status})`);
        }
        const data = await res.json();
        if (Array.isArray(data.list)) setList(data.list);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [isAuthenticated, getAccessTokenSilently]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSearchResult(null);
    if (!city.trim()) {
      setSearchResult(null);
      setCity('');
      return;
    }
    if (!isAuthenticated) {
      await loginWithRedirect();
      return;
    }
    try {
      setLoading(true);
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE || 'https://weather-api',
          scope: 'read:weather',
        }
      });
      const res = await fetch(`${API_BASE}/weather?city=${encodeURIComponent(city.trim())}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 403) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'You do not have the read:weather scope');
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Request failed (${res.status})`);
      }
      const data = await res.json();
      setSearchResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-page">
      <form onSubmit={onSubmit} className="weather-form">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading…' : 'Get Weather'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {searchResult ? (
        <div className="weather-grid">
          <WeatherCard
            key={searchResult.city || 'search-result'}
            city={searchResult.city}
            country={searchResult.country}
            temp={searchResult.temperature}
            minTemp={searchResult.minTemperature}
            maxTemp={searchResult.maxTemperature}
            description={searchResult.weather?.description}
            pressure={searchResult.pressure}
            humidity={searchResult.humidity}
            visibility={searchResult.visibility}
            wind={searchResult.wind}
            sunrise={
              searchResult.sunrise
                ? new Date(searchResult.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'N/A'
            }
            sunset={
              searchResult.sunset
                ? new Date(searchResult.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'N/A'
            }
            color={colorMap[0]}
            icon={iconMap[searchResult.weather?.main] || '⛅'}
          />
        </div>
      ) : (
        <div className="weather-grid">
          {list.map((cityItem, idx) => (
            <WeatherCard
              key={cityItem.id || idx}
              city={cityItem.name}
              country={cityItem.sys?.country}
              temp={cityItem.main?.temp}
              minTemp={cityItem.main?.temp_min}
              maxTemp={cityItem.main?.temp_max}
              description={cityItem.weather?.[0]?.description}
              pressure={cityItem.main?.pressure}
              humidity={cityItem.main?.humidity}
              visibility={cityItem.visibility}
              wind={cityItem.wind}
              sunrise={
                cityItem.sys?.sunrise
                  ? new Date(cityItem.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : 'N/A'
              }
              sunset={
                cityItem.sys?.sunset
                  ? new Date(cityItem.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : 'N/A'
              }
              color={colorMap[idx % colorMap.length]}
              icon={cityItem.weather?.[0]?.main ? iconMap[cityItem.weather[0].main] || '⛅' : '⛅'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Weather;
