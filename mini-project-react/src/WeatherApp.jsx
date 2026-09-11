import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import KeyIcon from '@mui/icons-material/Key';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import SearchBox from './SearchBox';
import InfoBox from './InfoBox';
import AiBanner from './components/AiBanner';
import ForecastCard from './components/ForecastCard';
import AdvisoryTabs from './components/AdvisoryTabs';
import ApiKeyModal from './components/ApiKeyModal';

import { aggregateForecastData, generateAiAdvisory } from './services/aiAdvisoryService';

// Default offline fallback data for Bengaluru to ensure immediate instant rendering
const MOCK_BENGALURU_CURRENT = {
  city: 'Bengaluru',
  country: 'IN',
  temp: 26.5,
  tempMin: 22,
  tempMax: 29,
  humidity: 84,
  feelsLike: 27.2,
  pressure: 1012,
  windSpeed: 14,
  weather: 'scattered clouds',
  icon: '03d',
  weatherMain: 'Clouds',
};

const MOCK_BENGALURU_FORECAST_LIST = Array.from({ length: 40 }, (_, i) => {
  const dt = Math.floor(Date.now() / 1000) + i * 3 * 3600;
  const isSunday = i >= 16 && i <= 24; // simulate rain on upcoming day
  return {
    dt,
    main: {
      temp: isSunday ? 21.5 : 26 + (i % 3),
      temp_min: 20,
      temp_max: 28,
      humidity: isSunday ? 92 : 75,
    },
    wind: { speed: isSunday ? 8.5 : 4.2 },
    weather: [
      {
        main: isSunday ? 'Rain' : 'Clouds',
        description: isSunday ? 'heavy intensity rain' : 'broken clouds',
        icon: isSunday ? '10d' : '04d',
      },
    ],
    pop: isSunday ? 0.85 : 0.2,
    rain: isSunday ? { '3h': 6.2 } : undefined,
  };
});

export default function WeatherApp() {
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [dailySummaries, setDailySummaries] = useState([]);
  const [aiAdvisory, setAiAdvisory] = useState(null);
  const [loading, setLoading] = useState(false);
  const getStoredApiKey = () => {
    try {
      return localStorage.getItem('gemini_api_key') || '';
    } catch (e) {
      return '';
    }
  };

  const [apiKey, setApiKey] = useState(getStoredApiKey);
  const [openSettings, setOpenSettings] = useState(false);

  const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
  const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
  const API_KEY = '49eeeac229341c76d67d964088c4766d';

  useEffect(() => {
    loadInitialData('Bengaluru');
  }, []);

  const loadInitialData = async (initialCity) => {
    setLoading(true);
    try {
      const weatherRes = await fetch(
        `${API_URL}?q=${encodeURIComponent(initialCity)}&appid=${API_KEY}&units=metric`
      );
      const weatherJson = await weatherRes.json();

      const forecastRes = await fetch(
        `${FORECAST_URL}?q=${encodeURIComponent(initialCity)}&appid=${API_KEY}&units=metric`
      );
      const forecastJson = await forecastRes.json();

      if (weatherJson && weatherJson.main && forecastJson && forecastJson.list) {
        const currentWeather = {
          city: weatherJson.name,
          country: weatherJson.sys?.country || 'IN',
          temp: Math.round(weatherJson.main.temp * 10) / 10,
          tempMin: Math.round(weatherJson.main.temp_min),
          tempMax: Math.round(weatherJson.main.temp_max),
          humidity: weatherJson.main.humidity,
          feelsLike: Math.round(weatherJson.main.feels_like * 10) / 10,
          pressure: weatherJson.main.pressure,
          windSpeed: Math.round((weatherJson.wind?.speed || 3) * 3.6),
          weather: weatherJson.weather[0]?.description || 'clear sky',
          icon: weatherJson.weather[0]?.icon || '01d',
          weatherMain: weatherJson.weather[0]?.main || 'Clear',
        };

        await processFullData(currentWeather, forecastJson.list, apiKey);
      } else {
        throw new Error('Invalid API response structure');
      }
    } catch (err) {
      console.warn('Network fetch failed or rate limited, loading default advisory state:', err);
      await processFullData(MOCK_BENGALURU_CURRENT, MOCK_BENGALURU_FORECAST_LIST, apiKey);
    } finally {
      setLoading(false);
    }
  };

  const processFullData = async (currentWeather, forecastList, currentKey) => {
    setWeatherInfo(currentWeather);

    // 1. Aggregate 5-Day Forecast
    const summaries = aggregateForecastData(forecastList);
    setDailySummaries(summaries);

    // 2. Generate Dynamic AI Advisory
    const advisory = await generateAiAdvisory(currentWeather.city, currentWeather, summaries, currentKey);
    setAiAdvisory(advisory);
  };

  const updateInfo = async ({ currentWeather, forecastList }) => {
    setLoading(true);
    try {
      await processFullData(currentWeather, forecastList, apiKey);
    } catch (err) {
      console.error('Error processing weather update:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKey = (newKey) => {
    setApiKey(newKey);
    try {
      if (newKey) {
        localStorage.setItem('gemini_api_key', newKey);
      } else {
        localStorage.removeItem('gemini_api_key');
      }
    } catch (e) {
      console.warn('LocalStorage access issue:', e);
    }
    if (weatherInfo && dailySummaries.length > 0) {
      setLoading(true);
      generateAiAdvisory(weatherInfo.city, weatherInfo, dailySummaries, newKey)
        .then((adv) => setAiAdvisory(adv))
        .finally(() => setLoading(false));
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 4, px: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">
        {/* APP HEADER */}
        <Box
          sx={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            mb: 4,
            pb: 2.5,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AutoAwesomeIcon sx={{ color: '#38bdf8', fontSize: 36 }} />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  background: 'linear-gradient(90deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.5px',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
                }}
              >
                AI Smart Crop & Travel Planner
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5, fontWeight: 500 }}>
              Data-Driven Meteorological Advisory & Agronomic Intelligence System
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Tooltip title="Configure Gemini AI Key">
              <Button
                variant="outlined"
                onClick={() => setOpenSettings(true)}
                startIcon={<KeyIcon sx={{ color: apiKey ? '#38bdf8' : '#94a3b8' }} />}
                sx={{
                  borderRadius: '12px',
                  color: '#e2e8f0',
                  borderColor: apiKey ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.15)',
                  backgroundColor: apiKey ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#38bdf8',
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  },
                }}
              >
                {apiKey ? 'Gemini AI API' : 'AI Engine: Built-in'}
              </Button>
            </Tooltip>
          </Box>
        </Box>

        {/* SEARCH BOX */}
        <SearchBox updateInfo={updateInfo} loading={loading} />

        {/* DYNAMIC AI BANNER */}
        <AiBanner advisory={aiAdvisory} loading={loading} />

        {/* ADVISORY TABS (CROP & TRAVEL) */}
        {aiAdvisory && <AdvisoryTabs advisory={aiAdvisory} />}

        {/* CURRENT WEATHER HERO CARD */}
        {weatherInfo && <InfoBox info={weatherInfo} />}

        {/* 5-DAY FORECAST BREAKDOWN */}
        {dailySummaries.length > 0 && <ForecastCard dailySummaries={dailySummaries} />}

        {/* GEMINI API KEY MODAL */}
        <ApiKeyModal
          open={openSettings}
          onClose={() => setOpenSettings(false)}
          apiKey={apiKey}
          onSaveKey={handleSaveKey}
        />
      </Container>
    </Box>
  );
}