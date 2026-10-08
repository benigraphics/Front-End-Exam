import React, { useMemo, useState } from 'react'
import { Box, Card, CardContent, Grid, Typography, Button, TextField, IconButton, Stack, Tooltip, Chip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/EditOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import PageHeader from '../components/PageHeader.jsx'
import StatusChip from '../components/StatusChip.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import EmptyState from '../components/EmptyState.jsx'
import LoanProductFormDialog from '../components/dialogs/LoanProductFormDialog.jsx'
import { useAppData } from '../context/AppContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { currency } from '../utils/calculations.js'

export default function LoanProducts() {
  const { loanProducts, loans, addLoanProduct, updateLoanProduct, deleteLoanProduct } = useAppData()
  const { t } = useLanguage()
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = useMemo(
    () => loanProducts.filter((p) => p.productName.toLowerCase().includes(search.trim().toLowerCase())),
    [loanProducts, search]
  )

  const loansForProduct = (productId) => loans.filter((l) => l.productId === productId).length

  return (
    <Box>
      <PageHeader
        title={t('pages.productsTitle')}
        subtitle={`${loanProducts.length} ${t('pages.productsSub')}`}
        actions={<Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setFormOpen(true) }}>{t('pages.productsAdd')}</Button>}
      />

      <Card sx={{ p: 2, mb: 2 }}>
        <TextField fullWidth size="small" label="Search products" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ maxWidth: 320 }} />
      </Card>

      {filtered.length === 0 ? (
        <Card><CardContent><EmptyState title="No loan products found" /></CardContent></Card>
      ) : (
        <Grid container spacing={2}>
          {filtered.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{p.productName}</Typography>
                    <StatusChip status={p.status} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 1.5, minHeight: 40 }}>{p.description}</Typography>
                  <Stack spacing={0.5}>
                    <Row label="Amount range" value={`${currency(p.minAmount)} — ${currency(p.maxAmount)}`} />
                    <Row label="Interest rate" value={`${p.interestRate}% p.a.`} />
                    <Row label="Duration" value={p.duration} />
                    <Row label="Active loans" value={loansForProduct(p.id)} />
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button size="small" startIcon={<EditIcon />} onClick={() => { setEditing(p); setFormOpen(true) }}>Edit</Button>
                    <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => setDeleteTarget(p)}>Delete</Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <LoanProductFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initialData={editing}
        onSubmit={(data) => (editing ? updateLoanProduct(editing.id, data) : addLoanProduct(data))}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete loan product?"
        message={deleteTarget ? `This will remove "${deleteTarget.productName}" from the product catalog.` : ''}
        onConfirm={() => deleteLoanProduct(deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  )
}

function Row({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="caption" sx={{ fontWeight: 600 }}>{value}</Typography>
    </Stack>
  )
}
