import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Card, Grid, TextField, MenuItem, Button, IconButton, Tooltip, Stack, LinearProgress } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined'
import PaymentsIcon from '@mui/icons-material/PaymentsOutlined'
import PageHeader from '../components/PageHeader.jsx'
import StatusChip from '../components/StatusChip.jsx'
import RepaymentFormDialog from '../components/dialogs/RepaymentFormDialog.jsx'
import { useAppData } from '../context/AppContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { currency, outstandingBalance } from '../utils/calculations.js'

const STATUSES = ['Pending', 'Active', 'Overdue', 'Completed', 'Written Off', 'Cancelled']

export default function Loans() {
  const navigate = useNavigate()
  const { loans, customers, loanOfficers, loanProducts, recordRepayment } = useAppData()
  const { t } = useLanguage()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [productFilter, setProductFilter] = useState('All')
  const [repayTarget, setRepayTarget] = useState(null)

  const findCustomer = (id) => customers.find((c) => c.id === id)
  const findOfficer = (id) => loanOfficers.find((o) => o.id === id)
  const findProduct = (id) => loanProducts.find((p) => p.id === id)

  const rows = useMemo(() => {
    return loans
      .filter((l) => (statusFilter === 'All' ? true : l.status === statusFilter))
      .filter((l) => (productFilter === 'All' ? true : l.productId === productFilter))
      .filter((l) => {
        const q = search.trim().toLowerCase()
        if (!q) return true
        const customer = findCustomer(l.customerId)
        return l.loanNumber.toLowerCase().includes(q) || (customer && customer.fullName.toLowerCase().includes(q))
      })
      .map((l) => ({
        ...l,
        customerName: findCustomer(l.customerId)?.fullName || '—',
        officerName: findOfficer(l.loanOfficerId)?.name || '—',
        productName: findProduct(l.productId)?.productName || '—',
        outstanding: outstandingBalance(l),
        progress: l.totalRepayable ? Math.min(100, Math.round((l.amountPaid / l.totalRepayable) * 100)) : 0,
      }))
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
  }, [loans, customers, loanOfficers, loanProducts, search, statusFilter, productFilter])

  const columns = [
    { field: 'loanNumber', headerName: 'Loan #', width: 120 },
    { field: 'customerName', headerName: 'Customer', width: 150 },
    { field: 'officerName', headerName: 'Officer', width: 130 },
    { field: 'productName', headerName: 'Product', width: 130 },
    { field: 'principalAmount', headerName: 'Principal', width: 110, valueFormatter: (p) => currency(p.value) },
    { field: 'totalRepayable', headerName: 'Repayable', width: 110, valueFormatter: (p) => currency(p.value) },
    { field: 'amountPaid', headerName: 'Paid', width: 110, valueFormatter: (p) => currency(p.value) },
    { field: 'outstanding', headerName: 'Outstanding', width: 120, valueFormatter: (p) => currency(p.value) },
    {
      field: 'progress', headerName: 'Progress', width: 110,
      renderCell: (p) => <LinearProgress variant="determinate" value={p.value} sx={{ width: '100%', height: 8, borderRadius: 4 }} />,
    },
    { field: 'dueDate', headerName: 'Due date', width: 110 },
    { field: 'status', headerName: 'Status', width: 120, renderCell: (p) => <StatusChip status={p.value} /> },
    {
      field: 'actions', headerName: 'Actions', width: 110, sortable: false, filterable: false,
      renderCell: (p) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="View details"><IconButton size="small" onClick={() => navigate(`/loans/${p.row.id}`)}><VisibilityIcon fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Record repayment">
            <span>
              <IconButton size="small" color="success" disabled={!['Active', 'Overdue', 'Pending'].includes(p.row.status)} onClick={() => setRepayTarget(p.row)}>
                <PaymentsIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      ),
    },
  ]

  return (
    <Box>
      <PageHeader title={t('pages.loansTitle')} subtitle={`${loans.length} ${t('pages.loansSub')}`} />

      <Card sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}>
            <TextField fullWidth size="small" label="Search loan # or customer" value={search} onChange={(e) => setSearch(e.target.value)} />
          </Grid>
          <Grid item xs={6} sm={3.5}>
            <TextField select fullWidth size="small" label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="All">All statuses</MenuItem>
              {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3.5}>
            <TextField select fullWidth size="small" label="Product" value={productFilter} onChange={(e) => setProductFilter(e.target.value)}>
              <MenuItem value="All">All products</MenuItem>
              {loanProducts.map((p) => <MenuItem key={p.id} value={p.id}>{p.productName}</MenuItem>)}
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
            onRowDoubleClick={(p) => navigate(`/loans/${p.row.id}`)}
          />
        </Box>
      </Card>

      <RepaymentFormDialog open={!!repayTarget} loan={repayTarget} onClose={() => setRepayTarget(null)} onSubmit={recordRepayment} />
    </Box>
  )
}
