import React, { useMemo } from 'react'
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom'
import { Box, Card, CardContent, Grid, Typography, Button, Chip, Divider, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PageHeader from '../components/PageHeader.jsx'
import StatusChip from '../components/StatusChip.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useAppData } from '../context/AppContext.jsx'
import { customerLoanSummary, currency, outstandingBalance } from '../utils/calculations.js'

export default function CustomerDetail() {
  const { customerId } = useParams()
  const navigate = useNavigate()
  const { customers, loans, loanOfficers, repayments, loanApplications } = useAppData()

  const customer = customers.find((c) => c.id === customerId)
  const officer = customer ? loanOfficers.find((o) => o.id === customer.loanOfficerId) : null
  const customerLoans = useMemo(() => loans.filter((l) => l.customerId === customerId), [loans, customerId])
  const customerApps = useMemo(() => loanApplications.filter((a) => a.customerId === customerId), [loanApplications, customerId])
  const customerRepayments = useMemo(
    () => repayments.filter((r) => r.customerId === customerId).sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)),
    [repayments, customerId]
  )
  const summary = customer ? customerLoanSummary(customerId, loans) : null

  if (!customer) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/customers')} sx={{ mb: 2 }}>Back to customers</Button>
        <EmptyState title="Customer not found" subtitle="It may have been deleted." />
      </Box>
    )
  }

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/customers')} sx={{ mb: 2 }}>Back to customers</Button>
      <PageHeader
        title={customer.fullName}
        subtitle={`${customer.customerNumber} · ${customer.branch} branch`}
        actions={<StatusChip status={customer.status} />}
      />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Personal Details</Typography>
              <Divider sx={{ mb: 1.5 }} />
              <DetailRow label="Gender" value={customer.gender} />
              <DetailRow label="Date of birth" value={customer.dateOfBirth} />
              <DetailRow label="Phone" value={customer.phone} />
              <DetailRow label="Address" value={customer.address} />
              <DetailRow label="Occupation" value={customer.occupation} />
              <DetailRow label="Loan officer" value={officer ? officer.name : '—'} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4}><SummaryCard label="Number of Loans" value={summary.numberOfLoans} /></Grid>
            <Grid item xs={6} sm={4}><SummaryCard label="Total Borrowed" value={currency(summary.totalBorrowed)} /></Grid>
            <Grid item xs={6} sm={4}><SummaryCard label="Outstanding Balance" value={currency(summary.outstandingBalance)} /></Grid>
          </Grid>
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Loan Applications</Typography>
              {customerApps.length === 0 ? <EmptyState title="No applications" subtitle="" /> : (
                <Table size="small">
                  <TableHead><TableRow><TableCell>ID</TableCell><TableCell>Amount</TableCell><TableCell>Date</TableCell><TableCell>Status</TableCell></TableRow></TableHead>
                  <TableBody>
                    {customerApps.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell>{a.id}</TableCell>
                        <TableCell>{currency(a.requestedAmount)}</TableCell>
                        <TableCell>{a.applicationDate}</TableCell>
                        <TableCell><StatusChip status={a.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Loans</Typography>
          {customerLoans.length === 0 ? <EmptyState title="No loans" subtitle="" /> : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Loan #</TableCell><TableCell>Principal</TableCell><TableCell>Total repayable</TableCell>
                  <TableCell>Paid</TableCell><TableCell>Outstanding</TableCell><TableCell>Status</TableCell><TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {customerLoans.map((l) => (
                  <TableRow key={l.id} hover>
                    <TableCell>{l.loanNumber}</TableCell>
                    <TableCell>{currency(l.principalAmount)}</TableCell>
                    <TableCell>{currency(l.totalRepayable)}</TableCell>
                    <TableCell>{currency(l.amountPaid)}</TableCell>
                    <TableCell>{currency(outstandingBalance(l))}</TableCell>
                    <TableCell><StatusChip status={l.status} /></TableCell>
                    <TableCell><Button size="small" component={RouterLink} to={`/loans/${l.id}`}>View</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Repayment History</Typography>
          {customerRepayments.length === 0 ? <EmptyState title="No repayments yet" subtitle="" /> : (
            <Table size="small">
              <TableHead><TableRow><TableCell>Receipt #</TableCell><TableCell>Loan</TableCell><TableCell>Date</TableCell><TableCell>Amount</TableCell><TableCell>Method</TableCell></TableRow></TableHead>
              <TableBody>
                {customerRepayments.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.receiptNumber}</TableCell>
                    <TableCell>{r.loanId}</TableCell>
                    <TableCell>{r.paymentDate}</TableCell>
                    <TableCell>{currency(r.amount)}</TableCell>
                    <TableCell>{r.paymentMethod}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
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

function SummaryCard({ label, value }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{value}</Typography>
      </CardContent>
    </Card>
  )
}
