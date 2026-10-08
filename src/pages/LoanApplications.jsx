import React, { useMemo, useState } from 'react'
import { Box, Card, Grid, TextField, MenuItem, Button, IconButton, Tooltip, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Divider } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/EditOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline'
import CancelIcon from '@mui/icons-material/CancelOutlined'
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined'
import PageHeader from '../components/PageHeader.jsx'
import StatusChip from '../components/StatusChip.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import ApplicationFormDialog from '../components/dialogs/ApplicationFormDialog.jsx'
import { useAppData } from '../context/AppContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { currency } from '../utils/calculations.js'

const STATUSES = ['Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Cancelled']

export default function LoanApplications() {
  const {
    loanApplications, customers, loanOfficers, loanProducts,
    addApplication, updateApplication, approveApplication, rejectApplication,
  } = useAppData()
  const { t } = useLanguage()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [customerFilter, setCustomerFilter] = useState('All')
  const [officerFilter, setOfficerFilter] = useState('All')

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [approveTarget, setApproveTarget] = useState(null)
  const [rejectTarget, setRejectTarget] = useState(null)
  const [viewing, setViewing] = useState(null)

  const findCustomer = (id) => customers.find((c) => c.id === id)
  const findOfficer = (id) => loanOfficers.find((o) => o.id === id)
  const findProduct = (id) => loanProducts.find((p) => p.id === id)

  const rows = useMemo(() => {
    return loanApplications
      .filter((a) => (statusFilter === 'All' ? true : a.status === statusFilter))
      .filter((a) => (customerFilter === 'All' ? true : a.customerId === customerFilter))
      .filter((a) => (officerFilter === 'All' ? true : a.loanOfficerId === officerFilter))
      .filter((a) => {
        const q = search.trim().toLowerCase()
        if (!q) return true
        const customer = findCustomer(a.customerId)
        return a.id.toLowerCase().includes(q) || (customer && customer.fullName.toLowerCase().includes(q))
      })
      .map((a) => ({
        ...a,
        customerName: findCustomer(a.customerId)?.fullName || '—',
        officerName: findOfficer(a.loanOfficerId)?.name || '—',
        productName: findProduct(a.productId)?.productName || '—',
      }))
      .sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate))
  }, [loanApplications, customers, loanOfficers, loanProducts, search, statusFilter, customerFilter, officerFilter])

  const columns = [
    { field: 'id', headerName: 'Application ID', width: 130 },
    { field: 'customerName', headerName: 'Customer', width: 160 },
    { field: 'officerName', headerName: 'Loan officer', width: 140 },
    { field: 'productName', headerName: 'Product', width: 140 },
    { field: 'requestedAmount', headerName: 'Amount', width: 120, valueFormatter: (p) => currency(p.value) },
    { field: 'applicationDate', headerName: 'Date', width: 110 },
    { field: 'purpose', headerName: 'Purpose', width: 150 },
    { field: 'duration', headerName: 'Duration', width: 90, valueFormatter: (p) => `${p.value} mo` },
    { field: 'status', headerName: 'Status', width: 130, renderCell: (p) => <StatusChip status={p.value} /> },
    {
      field: 'actions', headerName: 'Actions', width: 190, sortable: false, filterable: false,
      renderCell: (p) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="View"><IconButton size="small" onClick={() => setViewing(p.row)}><VisibilityIcon fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Edit"><IconButton size="small" onClick={() => { setEditing(p.row); setFormOpen(true) }} disabled={['Approved', 'Rejected', 'Cancelled'].includes(p.row.status)}><EditIcon fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Approve">
            <span>
              <IconButton size="small" color="success" disabled={!['Submitted', 'Under Review'].includes(p.row.status)} onClick={() => setApproveTarget(p.row)}>
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Reject">
            <span>
              <IconButton size="small" color="error" disabled={!['Submitted', 'Under Review'].includes(p.row.status)} onClick={() => setRejectTarget(p.row)}>
                <CancelIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      ),
    },
  ]

  return (
    <Box>
      <PageHeader
        title={t('pages.applicationsTitle')}
        subtitle={`${loanApplications.length} ${t('pages.applicationsSub')}`}
        actions={<Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setFormOpen(true) }}>{t('pages.applicationsAdd')}</Button>}
      />

      <Card sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField fullWidth size="small" label="Search ID or customer" value={search} onChange={(e) => setSearch(e.target.value)} />
          </Grid>
          <Grid item xs={6} sm={3} md={3}>
            <TextField select fullWidth size="small" label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="All">All statuses</MenuItem>
              {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3} md={3}>
            <TextField select fullWidth size="small" label="Customer" value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)}>
              <MenuItem value="All">All customers</MenuItem>
              {customers.map((c) => <MenuItem key={c.id} value={c.id}>{c.fullName}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
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

      <ApplicationFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initialData={editing}
        customers={customers}
        loanOfficers={loanOfficers}
        loanProducts={loanProducts}
        onSubmit={(data) => (editing ? updateApplication(editing.id, data) : addApplication(data))}
      />

      <ConfirmDialog
        open={!!approveTarget}
        title="Approve application?"
        message={approveTarget ? `Approving ${approveTarget.id} will create an active loan for ${findCustomer(approveTarget.customerId)?.fullName}.` : ''}
        confirmLabel="Approve"
        confirmColor="success"
        onConfirm={() => approveApplication(approveTarget.id)}
        onClose={() => setApproveTarget(null)}
      />

      <ConfirmDialog
        open={!!rejectTarget}
        title="Reject application?"
        message={rejectTarget ? `${rejectTarget.id} will be marked as Rejected.` : ''}
        confirmLabel="Reject"
        confirmColor="error"
        onConfirm={() => rejectApplication(rejectTarget.id)}
        onClose={() => setRejectTarget(null)}
      />

      <Dialog open={!!viewing} onClose={() => setViewing(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Application {viewing?.id}</DialogTitle>
        <DialogContent dividers>
          {viewing && (
            <Stack spacing={1}>
              <Typography variant="body2"><strong>Customer:</strong> {findCustomer(viewing.customerId)?.fullName}</Typography>
              <Typography variant="body2"><strong>Loan officer:</strong> {findOfficer(viewing.loanOfficerId)?.name}</Typography>
              <Typography variant="body2"><strong>Product:</strong> {findProduct(viewing.productId)?.productName}</Typography>
              <Typography variant="body2"><strong>Requested amount:</strong> {currency(viewing.requestedAmount)}</Typography>
              <Typography variant="body2"><strong>Duration:</strong> {viewing.duration} months</Typography>
              <Typography variant="body2"><strong>Purpose:</strong> {viewing.purpose}</Typography>
              <Typography variant="body2"><strong>Application date:</strong> {viewing.applicationDate}</Typography>
              {viewing.notes && <Typography variant="body2"><strong>Notes:</strong> {viewing.notes}</Typography>}
              <Divider />
              <StatusChip status={viewing.status} />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewing(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
