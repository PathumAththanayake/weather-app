const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const NodeCache = require('node-cache');

const router = express.Router();

const weatherCache = new NodeCache({ stdTTL: 300 }); // 5 minutes

router.get('/weather', async (req, res, next) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server configuration error', message: 'OPENWEATHER_API_KEY is not set' });
    }

    const cityName = (req.query.city || '').trim();
    if (cityName) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric`;
      const { data } = await axios.get(url);
      const payload = {
        city: data.name,
        country: data.sys?.country,
        coordinates: data.coord,
        temperature: data.main?.temp,
        minTemperature: data.main?.temp_min,
        maxTemperature: data.main?.temp_max,
        humidity: data.main?.humidity,
        pressure: data.main?.pressure,
        visibility: data.visibility,
        wind: data.wind,
        weather: data.weather?.[0] || null,
        sunrise: data.sys?.sunrise,
        sunset: data.sys?.sunset,
        raw: data
      };
      return res.json(payload);
    }

    const cacheKey = 'groupWeather';
    const cached = weatherCache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const citiesPath = path.join(__dirname, '..', 'cities.json');
    const citiesData = JSON.parse(fs.readFileSync(citiesPath, 'utf-8'));
    const cityCodes = (citiesData.List || []).map(c => c.CityCode).join(',');
    if (!cityCodes) {
      return res.status(500).json({ error: 'Server configuration error', message: 'No CityCode entries found in cities.json' });
    }

    const groupUrl = `https://api.openweathermap.org/data/2.5/group?id=${cityCodes}&units=metric&appid=${apiKey}`;
    const { data } = await axios.get(groupUrl);

    weatherCache.set(cacheKey, data);
    return res.json(data);
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ error: 'City not found', message: 'Please check the city name and try again' });
    }
    if (err.response?.status === 401 || err.response?.status === 403) {
      return res.status(500).json({ error: 'Upstream auth error', message: 'Weather API key invalid' });
    }
    return next(err);
  }
});

module.exports = router;
