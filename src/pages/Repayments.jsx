import React, { useMemo, useState } from 'react'
import { Box, Card, Grid, TextField, MenuItem } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import PageHeader from '../components/PageHeader.jsx'
import StatusChip from '../components/StatusChip.jsx'
import { useAppData } from '../context/AppContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { currency } from '../utils/calculations.js'

export default function Repayments() {
  const { repayments, customers, loanOfficers, loans } = useAppData()
  const { t } = useLanguage()

  const [search, setSearch] = useState('')
  const [methodFilter, setMethodFilter] = useState('All')
  const [officerFilter, setOfficerFilter] = useState('All')

  const findCustomer = (id) => customers.find((c) => c.id === id)
  const findOfficer = (id) => loanOfficers.find((o) => o.id === id)

  const rows = useMemo(() => {
    return repayments
      .filter((r) => (methodFilter === 'All' ? true : r.paymentMethod === methodFilter))
      .filter((r) => (officerFilter === 'All' ? true : r.loanOfficerId === officerFilter))
      .filter((r) => {
        const q = search.trim().toLowerCase()
        if (!q) return true
        const customer = findCustomer(r.customerId)
        return (
          r.receiptNumber.toLowerCase().includes(q) ||
          r.loanId.toLowerCase().includes(q) ||
          (customer && customer.fullName.toLowerCase().includes(q))
        )
      })
      .map((r) => ({
        ...r,
        customerName: findCustomer(r.customerId)?.fullName || '—',
        officerName: findOfficer(r.loanOfficerId)?.name || '—',
      }))
      .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
  }, [repayments, customers, loanOfficers, search, methodFilter, officerFilter])

  const columns = [
    { field: 'receiptNumber', headerName: 'Receipt #', width: 140 },
    { field: 'loanId', headerName: 'Loan', width: 120 },
    { field: 'customerName', headerName: 'Customer', width: 160 },
    { field: 'officerName', headerName: 'Officer', width: 140 },
    { field: 'paymentDate', headerName: 'Date', width: 110 },
    { field: 'amount', headerName: 'Amount', width: 120, valueFormatter: (p) => currency(p.value) },
    { field: 'paymentMethod', headerName: 'Method', width: 120 },
    { field: 'reference', headerName: 'Reference', width: 130 },
    { field: 'remainingBalance', headerName: 'Remaining balance', width: 150, valueFormatter: (p) => currency(p.value) },
    { field: 'status', headerName: 'Status', width: 110, renderCell: (p) => <StatusChip status={p.value} /> },
  ]

  return (
    <Box>
      <PageHeader title={t('pages.repaymentsTitle')} subtitle={`${repayments.length} ${t('pages.repaymentsSub')}`} />

      <Card sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}>
            <TextField fullWidth size="small" label="Search receipt, loan or customer" value={search} onChange={(e) => setSearch(e.target.value)} />
          </Grid>
          <Grid item xs={6} sm={3.5}>
            <TextField select fullWidth size="small" label="Payment method" value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)}>
              <MenuItem value="All">All methods</MenuItem>
              {['Cash', 'Bank', 'Mobile Money', 'Other'].map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3.5}>
            <TextField select fullWidth size="small" label="Loan officer" value={officerFilter} onChange={(e) => setOfficerFilter(e.target.value)}>
              <MenuItem value="All">All officers</MenuItem>
              {loanOfficers.map((o) => <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      <Card>
        <Box sx={{ height: 560 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            density="compact"
            disableRowSelectionOnClick
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            pageSizeOptions={[10, 25, 50]}
          />
        </Box>
      </Card>
    </Box>
  )
}
