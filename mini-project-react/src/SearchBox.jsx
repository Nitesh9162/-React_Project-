import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import './SearchBox.css';

export default function SearchBox({ updateInfo, loading }) {
  const [city, setCity] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
  const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
  const API_KEY = '49eeeac229341c76d67d964088c4766d';

  const QUICK_CITIES = ['Bengaluru', 'Mumbai', 'Delhi', 'London', 'Tokyo', 'New York'];

  const fetchWeatherData = async (searchCity) => {
    try {
      setError(false);
      setErrorMessage('');

      // Fetch Current Weather
      const weatherRes = await fetch(
        `${API_URL}?q=${encodeURIComponent(searchCity)}&appid=${API_KEY}&units=metric`
      );
      if (!weatherRes.ok) throw new Error('City not found. Please verify spelling.');
      const weatherJson = await weatherRes.json();

      // Fetch 5-Day Forecast
      const forecastRes = await fetch(
        `${FORECAST_URL}?q=${encodeURIComponent(searchCity)}&appid=${API_KEY}&units=metric`
      );
      if (!forecastRes.ok) throw new Error('Failed to retrieve forecast data.');
      const forecastJson = await forecastRes.json();

      const currentWeather = {
        city: weatherJson.name,
        country: weatherJson.sys.country,
        temp: Math.round(weatherJson.main.temp * 10) / 10,
        tempMin: Math.round(weatherJson.main.temp_min),
        tempMax: Math.round(weatherJson.main.temp_max),
        humidity: weatherJson.main.humidity,
        feelsLike: Math.round(weatherJson.main.feels_like * 10) / 10,
        pressure: weatherJson.main.pressure,
        windSpeed: Math.round(weatherJson.wind.speed * 3.6), // m/s to km/h
        weather: weatherJson.weather[0].description,
        icon: weatherJson.weather[0].icon,
        weatherMain: weatherJson.weather[0].main,
      };

      return {
        currentWeather,
        forecastList: forecastJson.list,
      };
    } catch (err) {
      throw err;
    }
  };

  const handleSearch = async (targetCity) => {
    if (!targetCity || !targetCity.trim()) return;

    try {
      const data = await fetchWeatherData(targetCity);
      updateInfo(data);
      setCity('');
    } catch (err) {
      setError(true);
      setErrorMessage(err.message || 'No such city found.');
    }
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    handleSearch(city);
  };

  const handleChipClick = (quickCity) => {
    handleSearch(quickCity);
  };

  return (
    <Box className="SearchBox" sx={{ mb: 4 }}>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: 'flex',
            justify: 'center',
            alignItems: 'center',
            gap: 1.5,
            flexWrap: 'wrap',
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          <TextField
            id="city"
            label="Enter City Name"
            variant="outlined"
            size="medium"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={loading}
            sx={{
              flexGrow: 1,
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                backgroundColor: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(10px)',
                borderRadius: '14px',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                '&:hover fieldset': { borderColor: '#38bdf8' },
                '&.Mui-focused fieldset': { borderColor: '#38bdf8' },
              },
              '& .MuiInputLabel-root': { color: '#94a3b8' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#38bdf8' },
            }}
          />
          <Button
            variant="contained"
            type="submit"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
            sx={{
              height: 56,
              px: 3,
              borderRadius: '14px',
              backgroundColor: '#0284c7',
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
              '&:hover': {
                backgroundColor: '#0369a1',
              },
            }}
          >
            {loading ? 'Analyzing...' : 'Search'}
          </Button>
        </Box>
      </form>

      {error && (
        <Alert
          severity="error"
          sx={{
            maxWidth: 600,
            mx: 'auto',
            mt: 2,
            borderRadius: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: '#fca5a5',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }}
        >
          {errorMessage}
        </Alert>
      )}

      {/* Quick City Selector Chips */}
      <Box sx={{ mt: 2.5, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, mr: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <LocationOnIcon sx={{ fontSize: 16, color: '#38bdf8' }} /> Popular Cities:
        </Typography>
        {QUICK_CITIES.map((qc) => (
          <Chip
            key={qc}
            label={qc}
            onClick={() => handleChipClick(qc)}
            size="small"
            clickable
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#e2e8f0',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(56, 189, 248, 0.2)',
                color: '#38bdf8',
                borderColor: '#38bdf8',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}