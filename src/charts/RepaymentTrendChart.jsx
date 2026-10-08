import React, { useMemo } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Card, CardContent, Typography } from '@mui/material'
import { repaymentTrend } from '../utils/calculations.js'
import { useAppData } from '../context/AppContext.jsx'

// Line chart: total repayments collected per month.
export default function RepaymentTrendChart() {
  const { repayments } = useAppData()
  const data = useMemo(() => repaymentTrend(repayments), [repayments])

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          Repayment Trend
        </Typography>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
            <Tooltip formatter={(value) => value.toLocaleString()} />
            <Line type="monotone" dataKey="amount" name="Repayments" stroke="#0B4F6C" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
