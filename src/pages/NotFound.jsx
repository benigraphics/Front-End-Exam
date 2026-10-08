import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <Box sx={{ textAlign: 'center', py: 10 }}>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>404</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>Page not found.</Typography>
      <Button variant="contained" onClick={() => navigate('/')}>Back to Dashboard</Button>
    </Box>
  )
}
