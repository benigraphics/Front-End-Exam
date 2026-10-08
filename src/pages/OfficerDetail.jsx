import React, { useMemo } from 'react'
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom'
import { Box, Card, CardContent, Grid, Typography, Button, Divider, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PageHeader from '../components/PageHeader.jsx'
import StatusChip from '../components/StatusChip.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useAppData } from '../context/AppContext.jsx'
import { officerPortfolioSummary, currency, outstandingBalance } from '../utils/calculations.js'

export default function OfficerDetail() {
  const { officerId } = useParams()
  const navigate = useNavigate()
  const ctx = useAppData()
  const { loanOfficers, customers, loans, repayments } = ctx

  const officer = loanOfficers.find((o) => o.id === officerId)
  const assignedCustomers = useMemo(() => customers.filter((c) => c.loanOfficerId === officerId), [customers, officerId])
  const officerLoans = useMemo(() => loans.filter((l) => l.loanOfficerId === officerId), [loans, officerId])
  const officerRepayments = useMemo(
    () => repayments.filter((r) => r.loanOfficerId === officerId).sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)).slice(0, 10),
    [repayments, officerId]
  )
  const summary = officer ? officerPortfolioSummary(officerId, ctx) : null

  if (!officer) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/officers')} sx={{ mb: 2 }}>Back to loan officers</Button>
        <EmptyState title="Loan officer not found" subtitle="" />
      </Box>
    )
  }

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/officers')} sx={{ mb: 2 }}>Back to loan officers</Button>
      <PageHeader title={officer.name} subtitle={`${officer.staffNumber} · ${officer.branch} branch`} actions={<StatusChip status={officer.status} />} />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Officer Details</Typography>
              <Divider sx={{ mb: 1.5 }} />
              <DetailRow label="Phone" value={officer.phone} />
              <DetailRow label="Email" value={officer.email} />
              <DetailRow label="Branch" value={officer.branch} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}><SummaryCard label="Customers" value={summary.assignedCustomers} /></Grid>
            <Grid item xs={6} sm={3}><SummaryCard label="Active Loans" value={summary.activeLoans} /></Grid>
            <Grid item xs={6} sm={3}><SummaryCard label="Completed" value={summary.completedLoans} /></Grid>
            <Grid item xs={6} sm={3}><SummaryCard label="Portfolio Value" value={currency(summary.portfolioValue)} /></Grid>
          </Grid>
        </Grid>
      </Grid>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Assigned Customers</Typography>
          {assignedCustomers.length === 0 ? <EmptyState title="No assigned customers" subtitle="" /> : (
            <Table size="small">
              <TableHead><TableRow><TableCell>Name</TableCell><TableCell>Branch</TableCell><TableCell>Status</TableCell><TableCell /></TableRow></TableHead>
              <TableBody>
                {assignedCustomers.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.fullName}</TableCell>
                    <TableCell>{c.branch}</TableCell>
                    <TableCell><StatusChip status={c.status} /></TableCell>
                    <TableCell><Button size="small" component={RouterLink} to={`/customers/${c.id}`}>View</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Loans Managed</Typography>
          {officerLoans.length === 0 ? <EmptyState title="No loans yet" subtitle="" /> : (
            <Table size="small">
              <TableHead><TableRow><TableCell>Loan #</TableCell><TableCell>Outstanding</TableCell><TableCell>Status</TableCell><TableCell /></TableRow></TableHead>
              <TableBody>
                {officerLoans.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>{l.loanNumber}</TableCell>
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
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Recent Repayments Collected</Typography>
          {officerRepayments.length === 0 ? <EmptyState title="No repayments yet" subtitle="" /> : (
            <Table size="small">
              <TableHead><TableRow><TableCell>Receipt #</TableCell><TableCell>Date</TableCell><TableCell>Amount</TableCell></TableRow></TableHead>
              <TableBody>
                {officerRepayments.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.receiptNumber}</TableCell>
                    <TableCell>{r.paymentDate}</TableCell>
                    <TableCell>{currency(r.amount)}</TableCell>
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
