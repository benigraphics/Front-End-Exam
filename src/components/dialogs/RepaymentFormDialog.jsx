import React, { useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, MenuItem, Alert, Typography } from '@mui/material'
import { outstandingBalance, currency } from '../../utils/calculations.js'

const emptyForm = { amount: '', paymentDate: new Date().toISOString().slice(0, 10), paymentMethod: 'Cash', reference: '' }

// Used to record a simulated repayment against a specific loan. Performs the
// required validation before calling recordRepayment() from AppContext.
export default function RepaymentFormDialog({ open, onClose, loan, onSubmit }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setForm(emptyForm)
      setError('')
    }
  }, [open, loan])

  if (!loan) return null
  const remaining = outstandingBalance(loan)

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = () => {
    const amount = Number(form.amount)
    if (!form.amount || Number.isNaN(amount) || amount <= 0) {
      setError('Enter a valid repayment amount.')
      return
    }
    if (amount > remaining) {
      setError(`Amount cannot exceed the outstanding balance of ${currency(remaining)}.`)
      return
    }
    const result = onSubmit(loan.id, { ...form, amount })
    if (result && result.success === false) {
      setError(result.message)
      return
    }
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Record Repayment</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Loan {loan.loanNumber} · Outstanding balance: <strong>{currency(remaining)}</strong>
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Amount" type="number" fullWidth value={form.amount} onChange={handleChange('amount')} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Payment date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={form.paymentDate} onChange={handleChange('paymentDate')} />
          </Grid>
          <Grid item xs={12}>
            <TextField select label="Payment method" fullWidth value={form.paymentMethod} onChange={handleChange('paymentMethod')}>
              {['Cash', 'Bank', 'Mobile Money', 'Other'].map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Reference (optional)" fullWidth value={form.reference} onChange={handleChange('reference')} placeholder="Auto-generated if left blank" />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Record repayment</Button>
      </DialogActions>
    </Dialog>
  )
}
