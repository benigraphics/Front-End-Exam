import React, { useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, MenuItem } from '@mui/material'

const emptyForm = {
  customerId: '', loanOfficerId: '', productId: '', requestedAmount: '',
  duration: 6, purpose: '', applicationDate: new Date().toISOString().slice(0, 10), notes: '',
}

export default function ApplicationFormDialog({ open, onClose, onSubmit, initialData, customers, loanOfficers, loanProducts }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (open) {
      setForm(initialData ? { ...emptyForm, ...initialData } : emptyForm)
      setErrors({})
    }
  }, [open, initialData])

  const handleChange = (field) => (e) => {
    const value = e.target.value
    setForm((f) => {
      const next = { ...f, [field]: value }
      if (field === 'customerId') {
        const customer = customers.find((c) => c.id === value)
        if (customer) next.loanOfficerId = customer.loanOfficerId
      }
      return next
    })
  }

  const selectedProduct = loanProducts.find((p) => p.id === form.productId)

  const validate = () => {
    const errs = {}
    if (!form.customerId) errs.customerId = 'Select a customer'
    if (!form.loanOfficerId) errs.loanOfficerId = 'Select a loan officer'
    if (!form.productId) errs.productId = 'Select a loan product'
    const amount = Number(form.requestedAmount)
    if (!form.requestedAmount || Number.isNaN(amount) || amount <= 0) errs.requestedAmount = 'Enter a valid amount'
    else if (selectedProduct && (amount < selectedProduct.minAmount || amount > selectedProduct.maxAmount)) {
      errs.requestedAmount = `Must be between ${selectedProduct.minAmount.toLocaleString()} and ${selectedProduct.maxAmount.toLocaleString()}`
    }
    if (!form.purpose.trim()) errs.purpose = 'Purpose is required'
    if (!form.applicationDate) errs.applicationDate = 'Application date is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    onSubmit({ ...form, requestedAmount: Number(form.requestedAmount), duration: Number(form.duration) })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Edit Loan Application' : 'New Loan Application'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField select label="Customer" fullWidth value={form.customerId} onChange={handleChange('customerId')} error={!!errors.customerId} helperText={errors.customerId}>
              {customers.map((c) => <MenuItem key={c.id} value={c.id}>{c.fullName} — {c.customerNumber}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Loan officer" fullWidth value={form.loanOfficerId} onChange={handleChange('loanOfficerId')} error={!!errors.loanOfficerId} helperText={errors.loanOfficerId}>
              {loanOfficers.map((o) => <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Loan product" fullWidth value={form.productId} onChange={handleChange('productId')} error={!!errors.productId} helperText={errors.productId}>
              {loanProducts.map((p) => <MenuItem key={p.id} value={p.id}>{p.productName}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Requested amount"
              type="number"
              fullWidth
              value={form.requestedAmount}
              onChange={handleChange('requestedAmount')}
              error={!!errors.requestedAmount}
              helperText={errors.requestedAmount || (selectedProduct ? `Range: ${selectedProduct.minAmount.toLocaleString()} - ${selectedProduct.maxAmount.toLocaleString()}` : '')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Duration (months)" fullWidth value={form.duration} onChange={handleChange('duration')}>
              {[3, 6, 9, 12, 18, 24, 36].map((d) => <MenuItem key={d} value={d}>{d} months</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Application date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={form.applicationDate} onChange={handleChange('applicationDate')} error={!!errors.applicationDate} helperText={errors.applicationDate} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Purpose" fullWidth value={form.purpose} onChange={handleChange('purpose')} error={!!errors.purpose} helperText={errors.purpose} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Notes" fullWidth multiline rows={2} value={form.notes} onChange={handleChange('notes')} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>{initialData ? 'Save changes' : 'Submit application'}</Button>
      </DialogActions>
    </Dialog>
  )
}
