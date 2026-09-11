import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function ForecastCard({ dailySummaries }) {
  if (!dailySummaries || dailySummaries.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <CalendarMonthIcon sx={{ color: '#38bdf8' }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>
          5-Day Forecast Breakdown
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' },
          gap: 2,
        }}
      >
        {dailySummaries.map((day, idx) => (
          <Card
            key={day.dateKey || idx}
            sx={{
              background: 'rgba(30, 41, 59, 0.7)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              p: 2,
              textAlign: 'center',
              color: '#fff',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                borderColor: 'rgba(56, 189, 248, 0.4)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
              },
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#f1f5f9' }}>
              {day.dayName}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1 }}>
              {day.formattedDate}
            </Typography>

            <Box
              component="img"
              src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
              alt={day.weatherDesc}
              sx={{ width: 60, height: 60, margin: '0 auto', display: 'block' }}
            />

            <Typography variant="body2" sx={{ textTransform: 'capitalize', color: '#cbd5e1', fontWeight: 500, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {day.weatherDesc}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, my: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                {day.maxTemp}°
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 500, color: '#64748b' }}>
                / {day.minTemp}°
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5, pt: 1, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#38bdf8' }}>
                <WaterDropIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {day.pop}%
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#94a3b8' }}>
                <AirIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {day.windSpeed} km/h
                </Typography>
              </Box>
            </Box>

            {day.pop >= 50 && (
              <Chip
                label={day.pop >= 70 ? 'Heavy Rain' : 'Rain Likely'}
                size="small"
                sx={{
                  mt: 1.5,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  height: 20,
                  backgroundColor: day.pop >= 70 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                  color: day.pop >= 70 ? '#fca5a5' : '#7dd3fc',
                  border: day.pop >= 70 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(56, 189, 248, 0.4)',
                }}
              />
            )}
          </Card>
        ))}
      </Box>
    </Box>
  );
}
