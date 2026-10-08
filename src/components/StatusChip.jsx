import React from 'react'
import { Chip } from '@mui/material'

const COLOR_MAP = {
  // Loan statuses
  Active: 'success',
  Overdue: 'error',
  Completed: 'primary',
  'Written Off': 'default',
  Cancelled: 'default',
  Pending: 'warning',
  // Application statuses
  Draft: 'default',
  Submitted: 'info',
  'Under Review': 'warning',
  Approved: 'success',
  Rejected: 'error',
  // Customer / officer statuses
  Inactive: 'default',
  // Repayment status
  Confirmed: 'success',
}

export default function StatusChip({ status, size = 'small' }) {
  const color = COLOR_MAP[status] || 'default'
  return <Chip label={status} color={color} size={size} variant={color === 'default' ? 'outlined' : 'filled'} />
}
