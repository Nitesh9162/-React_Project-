import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import KeyIcon from '@mui/icons-material/Key';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function ApiKeyModal({ open, onClose, apiKey, onSaveKey }) {
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setKeyInput(apiKey || '');
  }, [apiKey]);

  const handleSave = () => {
    onSaveKey(keyInput.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setKeyInput('');
    onSaveKey('');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#fff',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.15)',
          maxWidth: 480,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <KeyIcon sx={{ color: '#38bdf8' }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Configure Gemini AI API Key
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: '10px !important' }}>
        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2, lineHeight: 1.5 }}>
          Optionally add a free <strong>Google Gemini API Key</strong> to generate live LLM weather advisories. If left empty, the app uses its built-in <strong>Smart AI Advisory Engine</strong> out-of-the-box!
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Chip
            icon={<AutoAwesomeIcon sx={{ color: '#38bdf8 !important' }} />}
            label={apiKey ? 'Live Gemini AI Active' : 'Smart AI Rule Engine Active'}
            color={apiKey ? 'primary' : 'default'}
            sx={{ fontWeight: 600 }}
          />
        </Box>

        <TextField
          fullWidth
          label="Custom AI Token (Optional)"
          variant="outlined"
          placeholder="Enter custom service token..."
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          sx={{
            mt: 1,
            '& .MuiOutlinedInput-root': {
              color: '#fff',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '12px',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
              '&:hover fieldset': { borderColor: '#38bdf8' },
              '&.Mui-focused fieldset': { borderColor: '#38bdf8' },
            },
            '& .MuiInputLabel-root': { color: '#94a3b8' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#38bdf8' },
          }}
        />

        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#64748b' }}>
          Keys are stored locally in your browser's LocalStorage and never sent to any third party server.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, pt: 1, justifyContent: 'space-between' }}>
        <Button onClick={handleClear} sx={{ color: '#ef4444', textTransform: 'none' }}>
          Clear Key
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={onClose} sx={{ color: '#94a3b8', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            startIcon={saved ? <CheckCircleIcon /> : null}
            sx={{
              backgroundColor: saved ? '#10b981' : '#0284c7',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 700,
              '&:hover': { backgroundColor: saved ? '#059669' : '#0369a1' },
            }}
          >
            {saved ? 'Saved!' : 'Save & Apply'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
