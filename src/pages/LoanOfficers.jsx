import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Card, Grid, TextField, MenuItem, Button, IconButton, Tooltip, Stack } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/EditOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined'
import PageHeader from '../components/PageHeader.jsx'
import StatusChip from '../components/StatusChip.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import LoanOfficerFormDialog from '../components/dialogs/LoanOfficerFormDialog.jsx'
import { useAppData } from '../context/AppContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { officerPortfolioSummary, currency } from '../utils/calculations.js'
import { BRANCHES } from '../data/mockData.js'

export default function LoanOfficers() {
  const navigate = useNavigate()
  const ctx = useAppData()
  const { t } = useLanguage()
  const { loanOfficers, customers, loans, repayments, addLoanOfficer, updateLoanOfficer, deleteLoanOfficer } = ctx

  const [search, setSearch] = useState('')
  const [branchFilter, setBranchFilter] = useState('All')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const rows = useMemo(() => {
    return loanOfficers
      .filter((o) => (branchFilter === 'All' ? true : o.branch === branchFilter))
      .filter((o) => {
        const q = search.trim().toLowerCase()
        if (!q) return true
        return o.name.toLowerCase().includes(q) || o.staffNumber.toLowerCase().includes(q)
      })
      .map((o) => {
        const summary = officerPortfolioSummary(o.id, ctx)
        return { ...o, ...summary }
      })
  }, [loanOfficers, customers, loans, repayments, search, branchFilter])

  const columns = [
    { field: 'staffNumber', headerName: 'Staff #', width: 100 },
    { field: 'name', headerName: 'Name', width: 160 },
    { field: 'branch', headerName: 'Branch', width: 110 },
    { field: 'phone', headerName: 'Phone', width: 120 },
    { field: 'assignedCustomers', headerName: 'Customers', width: 100, type: 'number' },
    { field: 'activeLoans', headerName: 'Active loans', width: 110, type: 'number' },
    { field: 'completedLoans', headerName: 'Completed', width: 100, type: 'number' },
    { field: 'portfolioValue', headerName: 'Portfolio value', width: 140, valueFormatter: (p) => currency(p.value) },
    { field: 'outstandingBalance', headerName: 'Outstanding', width: 130, valueFormatter: (p) => currency(p.value) },
    { field: 'status', headerName: 'Status', width: 100, renderCell: (p) => <StatusChip status={p.value} /> },
    {
      field: 'actions', headerName: 'Actions', width: 140, sortable: false, filterable: false,
      renderCell: (p) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="View details"><IconButton size="small" onClick={() => navigate(`/officers/${p.row.id}`)}><VisibilityIcon fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Edit"><IconButton size="small" onClick={() => { setEditing(p.row); setFormOpen(true) }}><EditIcon fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Delete"><IconButton size="small" onClick={() => setDeleteTarget(p.row)}><DeleteIcon fontSize="small" color="error" /></IconButton></Tooltip>
        </Stack>
      ),
    },
  ]

  return (
    <Box>
      <PageHeader
        title={t('pages.officersTitle')}
        subtitle={`${loanOfficers.length} ${t('pages.officersSub')}`}
        actions={<Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setFormOpen(true) }}>{t('pages.officersAdd')}</Button>}
      />

      <Card sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth size="small" label="Search name or staff number" value={search} onChange={(e) => setSearch(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth size="small" label="Branch" value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
              <MenuItem value="All">All branches</MenuItem>
              {BRANCHES.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
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
            onRowDoubleClick={(p) => navigate(`/officers/${p.row.id}`)}
          />
        </Box>
      </Card>

      <LoanOfficerFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initialData={editing}
        onSubmit={(data) => (editing ? updateLoanOfficer(editing.id, data) : addLoanOfficer(data))}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete loan officer?"
        message={deleteTarget ? `This will remove ${deleteTarget.name} from staff records.` : ''}
        onConfirm={() => deleteLoanOfficer(deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  )
}
