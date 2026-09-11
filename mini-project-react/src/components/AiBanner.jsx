import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function AiBanner({ advisory, loading }) {
  if (loading) {
    return (
      <Card
        sx={{
          background: 'linear-gradient(135deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.1)',
          p: 3,
          mb: 4,
          color: '#fff',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AutoAwesomeIcon sx={{ color: '#38bdf8', fontSize: 32, animation: 'spin 3s linear infinite' }} />
          <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 500 }}>
            Analyzing 5-Day Meteorological & Agronomic Data...
          </Typography>
        </Box>
      </Card>
    );
  }

  if (!advisory) return null;

  const isHigh = advisory.alertLevel === 'High';
  const isMod = advisory.alertLevel === 'Moderate';

  const alertBg = isHigh
    ? 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(185,28,28,0.25) 100%)'
    : isMod
    ? 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(217,119,6,0.25) 100%)'
    : 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.25) 100%)';

  const alertBorder = isHigh
    ? 'rgba(239,68,68,0.5)'
    : isMod
    ? 'rgba(245,158,11,0.5)'
    : 'rgba(16,185,129,0.5)';

  const icon = isHigh ? (
    <WarningAmberIcon sx={{ color: '#ef4444', fontSize: 32 }} />
  ) : isMod ? (
    <InfoIcon sx={{ color: '#f59e0b', fontSize: 32 }} />
  ) : (
    <CheckCircleOutlineIcon sx={{ color: '#10b981', fontSize: 32 }} />
  );

  return (
    <Card
      className="ai-banner-card"
      sx={{
        background: alertBg,
        border: `1.5px solid ${alertBorder}`,
        borderRadius: '20px',
        p: { xs: 2.5, md: 3 },
        mb: 4,
        boxShadow: isHigh
          ? '0 12px 35px rgba(239,68,68,0.2)'
          : '0 12px 30px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease',
      }}
    >
      <CardContent sx={{ p: '0 !important' }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justify: 'space-between',
            alignItems: 'center',
            gap: 1.5,
            mb: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesomeIcon sx={{ color: '#38bdf8', fontSize: 24 }} />
            <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 1.5, color: '#38bdf8' }}>
              AI SMART WEATHER ADVISORY
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={`${advisory.alertLevel} Risk Alert`}
              size="small"
              sx={{
                fontWeight: 700,
                backgroundColor: isHigh ? '#ef4444' : isMod ? '#f59e0b' : '#10b981',
                color: '#fff',
              }}
            />
            <Chip
              label={advisory.source}
              size="small"
              variant="outlined"
              sx={{
                color: '#94a3b8',
                borderColor: 'rgba(255,255,255,0.2)',
                fontSize: '0.75rem',
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <Box sx={{ pt: 0.5 }}>{icon}</Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#f8fafc',
                lineHeight: 1.4,
                fontSize: { xs: '1.05rem', md: '1.25rem' },
              }}
            >
              "{advisory.dynamicHeadline}"
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
