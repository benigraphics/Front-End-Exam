import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Card, CardContent, Grid, Typography, Button, Divider, Table, TableHead, TableRow, TableCell, TableBody, LinearProgress, Stack } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PaymentsIcon from '@mui/icons-material/PaymentsOutlined'
import PageHeader from '../components/PageHeader.jsx'
import StatusChip from '../components/StatusChip.jsx'
import EmptyState from '../components/EmptyState.jsx'
import RepaymentFormDialog from '../components/dialogs/RepaymentFormDialog.jsx'
import { useAppData } from '../context/AppContext.jsx'
import { currency, outstandingBalance } from '../utils/calculations.js'

export default function LoanDetail() {
  const { loanId } = useParams()
  const navigate = useNavigate()
  const { loans, customers, loanOfficers, loanProducts, repayments, recordRepayment } = useAppData()
  const [repayOpen, setRepayOpen] = useState(false)

  const loan = loans.find((l) => l.id === loanId)
  const customer = loan ? customers.find((c) => c.id === loan.customerId) : null
  const officer = loan ? loanOfficers.find((o) => o.id === loan.loanOfficerId) : null
  const product = loan ? loanProducts.find((p) => p.id === loan.productId) : null
  const loanRepayments = useMemo(
    () => (loan ? repayments.filter((r) => r.loanId === loan.id).sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)) : []),
    [repayments, loan]
  )

  if (!loan) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/loans')} sx={{ mb: 2 }}>Back to loans</Button>
        <EmptyState title="Loan not found" subtitle="It may have been removed." />
      </Box>
    )
  }

  const progress = loan.totalRepayable ? Math.min(100, Math.round((loan.amountPaid / loan.totalRepayable) * 100)) : 0
  const remaining = outstandingBalance(loan)

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/loans')} sx={{ mb: 2 }}>Back to loans</Button>
      <PageHeader
        title={`Loan ${loan.loanNumber}`}
        subtitle={customer ? `${customer.fullName} · ${product?.productName || ''}` : ''}
        actions={
          <Stack direction="row" spacing={1} alignItems="center">
            <StatusChip status={loan.status} />
            <Button variant="contained" size="small" startIcon={<PaymentsIcon />} disabled={!['Active', 'Overdue', 'Pending'].includes(loan.status)} onClick={() => setRepayOpen(true)}>
              Record repayment
            </Button>
          </Stack>
        }
      />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Loan Summary</Typography>
              <Divider sx={{ mb: 1.5 }} />
              <DetailRow label="Loan officer" value={officer?.name || '—'} />
              <DetailRow label="Loan product" value={product?.productName || '—'} />
              <DetailRow label="Principal amount" value={currency(loan.principalAmount)} />
              <DetailRow label="Interest rate" value={`${loan.interestRate}% p.a.`} />
              <DetailRow label="Total repayable" value={currency(loan.totalRepayable)} />
              <DetailRow label="Amount paid" value={currency(loan.amountPaid)} />
              <DetailRow label="Outstanding balance" value={currency(remaining)} />
              <DetailRow label="Start date" value={loan.startDate} />
              <DetailRow label="Due date" value={loan.dueDate} />
              <DetailRow label="Duration" value={`${loan.duration} months`} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Repayment Progress</Typography>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5, mb: 1 }} />
              <Typography variant="body2" color="text.secondary">{progress}% repaid — {currency(loan.amountPaid)} of {currency(loan.totalRepayable)}</Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Repayment History</Typography>
              {loanRepayments.length === 0 ? <EmptyState title="No repayments recorded yet" subtitle="" /> : (
                <Table size="small">
                  <TableHead>
                    <TableRow><TableCell>Receipt #</TableCell><TableCell>Date</TableCell><TableCell>Amount</TableCell><TableCell>Method</TableCell><TableCell>Remaining balance</TableCell></TableRow>
                  </TableHead>
                  <TableBody>
                    {loanRepayments.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.receiptNumber}</TableCell>
                        <TableCell>{r.paymentDate}</TableCell>
                        <TableCell>{currency(r.amount)}</TableCell>
                        <TableCell>{r.paymentMethod}</TableCell>
                        <TableCell>{currency(r.remainingBalance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <RepaymentFormDialog open={repayOpen} loan={loan} onClose={() => setRepayOpen(false)} onSubmit={recordRepayment} />
    </Box>
  )
}

function DetailRow({ label, value }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>{value}</Typography>
    </Box>
  )
}
