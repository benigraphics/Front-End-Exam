import React from 'react'
import { Box, Typography } from '@mui/material'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'

export default function EmptyState({ title = 'No records found', subtitle = 'Try adjusting your search or filters.' }) {
  return (
    <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
      <InboxOutlinedIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{title}</Typography>
      <Typography variant="body2">{subtitle}</Typography>
    </Box>
  )
}
