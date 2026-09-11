import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import GrainIcon from '@mui/icons-material/Grain';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import CompressIcon from '@mui/icons-material/Compress';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import './InfoBox.css';

export default function InfoBox({ info }) {
  if (!info) return null;

  const bgGradient = isRain
    ? 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)'
    : isHot
    ? 'linear-gradient(135deg, #7c2d12 0%, #1e1b4b 100%)'
    : 'linear-gradient(135deg, #0c4a6e 0%, #0f172a 100%)';

  const weatherIcon = isRain ? (
    <ThunderstormIcon sx={{ color: '#60a5fa', fontSize: 32 }} />
  ) : isHot ? (
    <WbSunnyIcon sx={{ color: '#fbbf24', fontSize: 32 }} />
  ) : (
    <AcUnitIcon sx={{ color: '#a5f3fc', fontSize: 32 }} />
  );

  return (
    <div className="InfoBox">
      <Card
        sx={{
          borderRadius: '24px',
          overflow: 'hidden',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#fff',
          boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
          mb: 4,
        }}
      >
        <Box
          sx={{
            height: 180,
            background: bgGradient,
            p: 3,
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-end' }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
                    {info.city}
                  </Typography>
                  {info.country && (
                    <Chip
                      label={info.country}
                      size="small"
                      sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700 }}
                    />
                  )}
                  {weatherIcon}
                </Box>
                <Typography variant="subtitle1" sx={{ color: '#cbd5e1', textTransform: 'capitalize', fontWeight: 500 }}>
                  {info.weather}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h2" sx={{ fontWeight: 900, color: '#f8fafc', lineHeight: 1 }}>
                  {Math.round(info.temp)}&deg;C
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
                  Feels like {Math.round(info.feelsLike)}&deg;C
                </Typography>
              </Box>
            </Box>
          </Box>

        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box className="weather-metric-box">
                <WaterDropIcon sx={{ color: '#38bdf8', fontSize: 24, mb: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                  Humidity
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                  {info.humidity}%
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <Box className="weather-metric-box">
                <AirIcon sx={{ color: '#818cf8', fontSize: 24, mb: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                  Wind Speed
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                  {info.windSpeed || 12} km/h
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <Box className="weather-metric-box">
                <ThermostatIcon sx={{ color: '#f43f5e', fontSize: 24, mb: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                  Temp High / Low
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                  {Math.round(info.tempMax)}° / {Math.round(info.tempMin)}°
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <Box className="weather-metric-box">
                <CompressIcon sx={{ color: '#34d399', fontSize: 24, mb: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                  Pressure
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                  {info.pressure || 1012} hPa
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}