import React, { useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, MenuItem } from '@mui/material'

const emptyForm = { productName: '', minAmount: '', maxAmount: '', interestRate: '', duration: '', description: '', status: 'Active' }

export default function LoanProductFormDialog({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (open) {
      setForm(initialData ? { ...emptyForm, ...initialData } : emptyForm)
      setErrors({})
    }
  }, [open, initialData])

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.productName.trim()) errs.productName = 'Product name is required'
    const min = Number(form.minAmount)
    const max = Number(form.maxAmount)
    if (!form.minAmount || Number.isNaN(min) || min <= 0) errs.minAmount = 'Enter a valid minimum'
    if (!form.maxAmount || Number.isNaN(max) || max <= 0) errs.maxAmount = 'Enter a valid maximum'
    if (min && max && min >= max) errs.maxAmount = 'Maximum must be greater than minimum'
    const rate = Number(form.interestRate)
    if (!form.interestRate || Number.isNaN(rate) || rate <= 0) errs.interestRate = 'Enter a valid interest rate'
    if (!form.duration) errs.duration = 'Duration is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    onSubmit({ ...form, minAmount: Number(form.minAmount), maxAmount: Number(form.maxAmount), interestRate: Number(form.interestRate) })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Edit Loan Product' : 'Add Loan Product'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField label="Product name" fullWidth value={form.productName} onChange={handleChange('productName')} error={!!errors.productName} helperText={errors.productName} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Minimum amount" type="number" fullWidth value={form.minAmount} onChange={handleChange('minAmount')} error={!!errors.minAmount} helperText={errors.minAmount} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Maximum amount" type="number" fullWidth value={form.maxAmount} onChange={handleChange('maxAmount')} error={!!errors.maxAmount} helperText={errors.maxAmount} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Interest rate (% p.a.)" type="number" fullWidth value={form.interestRate} onChange={handleChange('interestRate')} error={!!errors.interestRate} helperText={errors.interestRate} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Duration" fullWidth placeholder="e.g. 3-24 months" value={form.duration} onChange={handleChange('duration')} error={!!errors.duration} helperText={errors.duration} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Description" fullWidth multiline rows={2} value={form.description} onChange={handleChange('description')} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Status" fullWidth value={form.status} onChange={handleChange('status')}>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>{initialData ? 'Save changes' : 'Add product'}</Button>
      </DialogActions>
    </Dialog>
  )
}
