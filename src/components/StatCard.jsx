import React from 'react'
import { Card, CardContent, Stack, Typography, Box } from '@mui/material'
import { motion } from 'framer-motion'

const MotionCard = motion(Card)

export default function StatCard({ title, value, icon, color = 'primary.main', subtitle }) {
  return (
    <MotionCard
      sx={{ height: '100%' }}
      whileHover={{ y: -3, boxShadow: '0 8px 20px rgba(11,79,108,0.14)' }}
      transition={{ duration: 0.18 }}
    >
      <CardContent>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: color,
              color: '#fff',
              opacity: 0.9,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </MotionCard>
  )
}
