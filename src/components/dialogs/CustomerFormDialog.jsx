import React, { useEffect, useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, MenuItem,
} from '@mui/material'
import { BRANCHES } from '../../data/mockData.js'

const emptyForm = {
  fullName: '', gender: 'Male', dateOfBirth: '', phone: '', address: '',
  occupation: '', branch: BRANCHES[0], loanOfficerId: '', status: 'Active',
}

// Controlled form dialog reused for both "Add customer" and "Edit customer".
export default function CustomerFormDialog({ open, onClose, onSubmit, initialData, loanOfficers }) {
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
    if (!form.fullName.trim()) errs.fullName = 'Full name is required'
    if (!form.phone.trim()) errs.phone = 'Phone is required'
    else if (!/^0\d{9}$/.test(form.phone.trim())) errs.phone = 'Phone must be 10 digits, starting with 0'
    if (!form.dateOfBirth) errs.dateOfBirth = 'Date of birth is required'
    if (!form.loanOfficerId) errs.loanOfficerId = 'Assign a loan officer'
    if (!form.address.trim()) errs.address = 'Address is required'
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
      <DialogTitle>{initialData ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={8}>
            <TextField label="Full name" fullWidth value={form.fullName} onChange={handleChange('fullName')} error={!!errors.fullName} helperText={errors.fullName} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField select label="Gender" fullWidth value={form.gender} onChange={handleChange('gender')}>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Date of birth" type="date" fullWidth InputLabelProps={{ shrink: true }} value={form.dateOfBirth} onChange={handleChange('dateOfBirth')} error={!!errors.dateOfBirth} helperText={errors.dateOfBirth} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Phone" fullWidth value={form.phone} onChange={handleChange('phone')} error={!!errors.phone} helperText={errors.phone || 'e.g. 0788123456'} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Address" fullWidth value={form.address} onChange={handleChange('address')} error={!!errors.address} helperText={errors.address} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Occupation / business" fullWidth value={form.occupation} onChange={handleChange('occupation')} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Branch" fullWidth value={form.branch} onChange={handleChange('branch')}>
              {BRANCHES.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Loan officer" fullWidth value={form.loanOfficerId} onChange={handleChange('loanOfficerId')} error={!!errors.loanOfficerId} helperText={errors.loanOfficerId}>
              {loanOfficers.map((o) => <MenuItem key={o.id} value={o.id}>{o.name} ({o.branch})</MenuItem>)}
            </TextField>
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
        <Button variant="contained" onClick={handleSubmit}>{initialData ? 'Save changes' : 'Add customer'}</Button>
      </DialogActions>
    </Dialog>
  )
}
