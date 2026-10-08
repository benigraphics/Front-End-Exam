import React, { useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, MenuItem } from '@mui/material'
import { BRANCHES } from '../../data/mockData.js'

const emptyForm = { name: '', gender: 'Male', branch: BRANCHES[0], phone: '', email: '', status: 'Active' }

export default function LoanOfficerFormDialog({ open, onClose, onSubmit, initialData }) {
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
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.phone.trim()) errs.phone = 'Phone is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    onSubmit(form)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Edit Loan Officer' : 'Add Loan Officer'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={8}>
            <TextField label="Full name" fullWidth value={form.name} onChange={handleChange('name')} error={!!errors.name} helperText={errors.name} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField select label="Gender" fullWidth value={form.gender} onChange={handleChange('gender')}>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Branch" fullWidth value={form.branch} onChange={handleChange('branch')}>
              {BRANCHES.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Phone" fullWidth value={form.phone} onChange={handleChange('phone')} error={!!errors.phone} helperText={errors.phone} />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField label="Email" fullWidth value={form.email} onChange={handleChange('email')} error={!!errors.email} helperText={errors.email} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField select label="Status" fullWidth value={form.status} onChange={handleChange('status')}>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>{initialData ? 'Save changes' : 'Add officer'}</Button>
      </DialogActions>
    </Dialog>
  )
}
