import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Card, TextField, MenuItem, Grid, IconButton, Tooltip, Button, Chip, Stack,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/EditOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined'
import PageHeader from '../components/PageHeader.jsx'
import StatusChip from '../components/StatusChip.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import CustomerFormDialog from '../components/dialogs/CustomerFormDialog.jsx'
import { useAppData } from '../context/AppContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { customerLoanSummary, currency } from '../utils/calculations.js'
import { BRANCHES } from '../data/mockData.js'

export default function Customers() {
  const navigate = useNavigate()
  const { customers, loans, loanOfficers, addCustomer, updateCustomer, deleteCustomer } = useAppData()
  const { t } = useLanguage()

  const [search, setSearch] = useState('')
  const [branchFilter, setBranchFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [officerFilter, setOfficerFilter] = useState('All')

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const findOfficer = (id) => loanOfficers.find((o) => o.id === id)

  const rows = useMemo(() => {
    return customers
      .filter((c) => (branchFilter === 'All' ? true : c.branch === branchFilter))
      .filter((c) => (statusFilter === 'All' ? true : c.status === statusFilter))
      .filter((c) => (officerFilter === 'All' ? true : c.loanOfficerId === officerFilter))
      .filter((c) => {
        const q = search.trim().toLowerCase()
        if (!q) return true
        return (
          c.fullName.toLowerCase().includes(q) ||
          c.customerNumber.toLowerCase().includes(q) ||
          c.phone.includes(q)
        )
      })
      .map((c) => {
        const summary = customerLoanSummary(c.id, loans)
        const officer = findOfficer(c.loanOfficerId)
        return {
          ...c,
          officerName: officer ? officer.name : '—',
          numberOfLoans: summary.numberOfLoans,
          totalBorrowed: summary.totalBorrowed,
          outstandingBalance: summary.outstandingBalance,
        }
      })
  }, [customers, loans, search, branchFilter, statusFilter, officerFilter])

  const columns = [
    { field: 'customerNumber', headerName: 'Customer #', width: 120 },
    { field: 'fullName', headerName: 'Full name', width: 170 },
    { field: 'phone', headerName: 'Phone', width: 120 },
    { field: 'branch', headerName: 'Branch', width: 110 },
    { field: 'officerName', headerName: 'Loan officer', width: 150 },
    { field: 'numberOfLoans', headerName: 'Loans', width: 80, type: 'number' },
    { field: 'totalBorrowed', headerName: 'Total borrowed', width: 140, valueFormatter: (p) => currency(p.value) },
    { field: 'outstandingBalance', headerName: 'Outstanding', width: 140, valueFormatter: (p) => currency(p.value) },
    {
      field: 'status', headerName: 'Status', width: 110,
      renderCell: (p) => <StatusChip status={p.value} />,
    },
    {
      field: 'actions', headerName: 'Actions', width: 150, sortable: false, filterable: false,
      renderCell: (p) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="View details">
            <IconButton size="small" onClick={() => navigate(`/customers/${p.row.id}`)}><VisibilityIcon fontSize="small" /></IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => { setEditing(p.row); setFormOpen(true) }}><EditIcon fontSize="small" /></IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => setDeleteTarget(p.row)}><DeleteIcon fontSize="small" color="error" /></IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ]

  return (
    <Box>
      <PageHeader
        title={t('pages.customersTitle')}
        subtitle={`${customers.length} ${t('pages.customersSub')}`}
        actions={<Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setFormOpen(true) }}>{t('pages.customersAdd')}</Button>}
      />

      <Card sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField fullWidth size="small" label="Search name, number or phone" value={search} onChange={(e) => setSearch(e.target.value)} />
          </Grid>
          <Grid item xs={6} sm={3} md={3}>
            <TextField select fullWidth size="small" label="Branch" value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
              <MenuItem value="All">All branches</MenuItem>
              {BRANCHES.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3} md={3}>
            <TextField select fullWidth size="small" label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="All">All statuses</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
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
            initialState={{ pagination: { paginationModel: { pageSize: 10 } }, sorting: { sortModel: [{ field: 'fullName', sort: 'asc' }] } }}
            pageSizeOptions={[10, 25, 50]}
            onRowDoubleClick={(p) => navigate(`/customers/${p.row.id}`)}
          />
        </Box>
      </Card>

      <CustomerFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initialData={editing}
        loanOfficers={loanOfficers}
        onSubmit={(data) => (editing ? updateCustomer(editing.id, data) : addCustomer(data))}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete customer?"
        message={deleteTarget ? `This will remove ${deleteTarget.fullName} from the customer list. This cannot be undone.` : ''}
        onConfirm={() => deleteCustomer(deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  )
}
