import React, { useMemo } from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import { Card, CardContent, Typography } from '@mui/material'
import { loanStatusDistribution } from '../utils/calculations.js'
import { useAppData } from '../context/AppContext.jsx'

const COLORS = {
  Active: '#2E7D32',
  Completed: '#0B4F6C',
  Pending: '#ED6C02',
  Overdue: '#C62828',
  'Written Off': '#757575',
  Cancelled: '#9E9E9E',
}

// Pie chart: distribution of loans across statuses.
export default function LoanStatusPieChart() {
  const { loans } = useAppData()
  const data = useMemo(() => loanStatusDistribution(loans), [loans])

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          Loan Status Distribution
        </Typography>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label={(entry) => `${entry.name}: ${entry.value}`}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name] || '#999'} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
