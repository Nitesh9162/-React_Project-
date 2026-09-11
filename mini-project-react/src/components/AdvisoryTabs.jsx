import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import ShieldIcon from '@mui/icons-material/Shield';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`advisory-tabpanel-${index}`}
      aria-labelledby={`advisory-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdvisoryTabs({ advisory }) {
  const [tabIndex, setTabIndex] = useState(0);

  if (!advisory) return null;

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Card
      sx={{
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(16px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        p: { xs: 2, md: 3 },
        mb: 4,
        color: '#fff',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: tabIndex === 0 ? '#10b981' : '#38bdf8',
              height: 3,
              borderRadius: '3px',
            },
          }}
        >
          <Tab
            icon={<AgricultureIcon sx={{ color: tabIndex === 0 ? '#10b981' : '#94a3b8' }} />}
            iconPosition="start"
            label="🚜 Smart Crop Advisory"
            sx={{
              color: tabIndex === 0 ? '#10b981' : '#94a3b8',
              fontWeight: 700,
              fontSize: { xs: '0.85rem', md: '1rem' },
              textTransform: 'none',
              '&.Mui-selected': { color: '#10b981' },
            }}
          />
          <Tab
            icon={<DirectionsCarIcon sx={{ color: tabIndex === 1 ? '#38bdf8' : '#94a3b8' }} />}
            iconPosition="start"
            label="🚗 Travel & Commute Safety"
            sx={{
              color: tabIndex === 1 ? '#38bdf8' : '#94a3b8',
              fontWeight: 700,
              fontSize: { xs: '0.85rem', md: '1rem' },
              textTransform: 'none',
              '&.Mui-selected': { color: '#38bdf8' },
            }}
          />
        </Tabs>
      </Box>

      {/* CROP ADVISORY TAB */}
      <CustomTabPanel value={tabIndex} index={0}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <LocalFloristIcon sx={{ color: '#10b981' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                Agricultural & Soil Strategy
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: '#cbd5e1', lineHeight: 1.6, mb: 2 }}>
              {advisory.cropSummary}
            </Typography>

            <Typography variant="subtitle2" sx={{ color: '#10b981', fontWeight: 700, mb: 1, letterSpacing: 0.5 }}>
              ACTIONABLE FIELD GUIDANCE:
            </Typography>
            <List disablePadding>
              {advisory.cropTips?.map((tip, idx) => (
                <ListItem key={idx} sx={{ px: 0, py: 0.75 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={tip}
                    primaryTypographyProps={{ variant: 'body2', color: '#e2e8f0', fontWeight: 500 }}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '16px',
                p: 2.5,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#6ee7b7', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShieldIcon sx={{ fontSize: 20 }} /> Crop Protection Radar
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 0.5 }}>
                  Fertilizer Status
                </Typography>
                <Chip
                  label={advisory.alertLevel === 'High' ? '⚠️ Delay Fertilizer Application' : '✅ Normal Fertilizer Schedule'}
                  sx={{
                    fontWeight: 700,
                    backgroundColor: advisory.alertLevel === 'High' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: advisory.alertLevel === 'High' ? '#fca5a5' : '#6ee7b7',
                    border: advisory.alertLevel === 'High' ? '1px solid #ef4444' : '1px solid #10b981',
                  }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 0.5 }}>
                  Irrigation Recommendation
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#f1f5f9' }}>
                  {advisory.alertLevel === 'High' || advisory.alertLevel === 'Moderate'
                    ? 'Reduce automated irrigation; rely on natural rain.'
                    : 'Maintain regular early-morning drip irrigation cycles.'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CustomTabPanel>

      {/* TRAVEL SAFETY TAB */}
      <CustomTabPanel value={tabIndex} index={1}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <DirectionsCarIcon sx={{ color: '#38bdf8' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                Commute & Road Safety Analysis
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: '#cbd5e1', lineHeight: 1.6, mb: 2 }}>
              {advisory.travelSummary}
            </Typography>

            <Typography variant="subtitle2" sx={{ color: '#38bdf8', fontWeight: 700, mb: 1, letterSpacing: 0.5 }}>
              SAFETY PRECAUTIONS & GEAR:
            </Typography>
            <List disablePadding>
              {advisory.travelTips?.map((tip, idx) => (
                <ListItem key={idx} sx={{ px: 0, py: 0.75 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon sx={{ color: '#38bdf8', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={tip}
                    primaryTypographyProps={{ variant: 'body2', color: '#e2e8f0', fontWeight: 500 }}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '16px',
                p: 2.5,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#7dd3fc', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShieldIcon sx={{ fontSize: 20 }} /> Travel Matrix
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 0.5 }}>
                  Best Day to Travel
                </Typography>
                <Chip
                  icon={<EventAvailableIcon sx={{ color: '#10b981 !important' }} />}
                  label={advisory.bestTravelDay}
                  sx={{ fontWeight: 700, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', border: '1px solid #10b981' }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 0.5 }}>
                  Highest Hazard Risk Day
                </Typography>
                <Chip
                  icon={<EventBusyIcon sx={{ color: '#ef4444 !important' }} />}
                  label={advisory.worstTravelDay}
                  sx={{ fontWeight: 700, backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid #ef4444' }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CustomTabPanel>
    </Card>
  );
}
