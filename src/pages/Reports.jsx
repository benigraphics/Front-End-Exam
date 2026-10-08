import React, { useMemo, useState } from 'react'
import {
  Box, Card, CardContent, Grid, Typography, Tabs, Tab, TextField, MenuItem, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, Divider,
} from '@mui/material'
import PrintIcon from '@mui/icons-material/PrintOutlined'
import DownloadIcon from '@mui/icons-material/FileDownloadOutlined'
import PageHeader from '../components/PageHeader.jsx'
import StatusChip from '../components/StatusChip.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useAppData } from '../context/AppContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { currency, outstandingBalance, officerPortfolioSummary } from '../utils/calculations.js'
import { BRANCHES } from '../data/mockData.js'

const REPORTS = [
  'Loan Portfolio', 'Active Loans', 'Completed Loans', 'Outstanding Balance',
  'Repayment Report', 'Loan Officer Performance', 'Loan Status Report', 'Loan Product Summary',
]

// Simulated CSV export — builds a CSV string client-side and triggers a
// browser download. No server or external API is involved (frontend only).
function exportCsv(filename, headers, rows) {
  const escape = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`
  const csv = [headers.map(escape).join(','), ...rows.map((row) => row.map(escape).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function Reports() {
  const ctx = useAppData()
  const { t } = useLanguage()
  const { customers, loans, loanApplications, repayments, loanOfficers, loanProducts } = ctx

  const [tab, setTab] = useState(0)
  const [branch, setBranch] = useState('All')
  const [officer, setOfficer] = useState('All')
  const [product, setProduct] = useState('All')
  const [status, setStatus] = useState('All')
  const [customer, setCustomer] = useState('All')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const findCustomer = (id) => customers.find((c) => c.id === id)
  const findOfficer = (id) => loanOfficers.find((o) => o.id === id)
  const findProduct = (id) => loanProducts.find((p) => p.id === id)
  const customerBranch = (customerId) => findCustomer(customerId)?.branch

  const inDateRange = (dateStr) => {
    if (!dateStr) return true
    if (dateFrom && dateStr < dateFrom) return false
    if (dateTo && dateStr > dateTo) return false
    return true
  }

  const filteredLoans = useMemo(() => {
    return loans
      .filter((l) => (branch === 'All' ? true : customerBranch(l.customerId) === branch))
      .filter((l) => (officer === 'All' ? true : l.loanOfficerId === officer))
      .filter((l) => (product === 'All' ? true : l.productId === product))
      .filter((l) => (status === 'All' ? true : l.status === status))
      .filter((l) => (customer === 'All' ? true : l.customerId === customer))
      .filter((l) => inDateRange(l.startDate))
  }, [loans, customers, branch, officer, product, status, customer, dateFrom, dateTo])

  const filteredRepayments = useMemo(() => {
    return repayments
      .filter((r) => (branch === 'All' ? true : customerBranch(r.customerId) === branch))
      .filter((r) => (officer === 'All' ? true : r.loanOfficerId === officer))
      .filter((r) => (customer === 'All' ? true : r.customerId === customer))
      .filter((r) => inDateRange(r.paymentDate))
  }, [repayments, customers, branch, officer, customer, dateFrom, dateTo])

  const filterBar = (
    <Card sx={{ p: 2, mb: 2 }} className="no-print">
      <Grid container spacing={2}>
        <Grid item xs={6} sm={3} md={1.7}>
          <TextField label="From" type="date" size="small" fullWidth InputLabelProps={{ shrink: true }} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </Grid>
        <Grid item xs={6} sm={3} md={1.7}>
          <TextField label="To" type="date" size="small" fullWidth InputLabelProps={{ shrink: true }} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </Grid>
        <Grid item xs={6} sm={3} md={1.7}>
          <TextField select label="Branch" size="small" fullWidth value={branch} onChange={(e) => setBranch(e.target.value)}>
            <MenuItem value="All">All</MenuItem>
            {BRANCHES.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={6} sm={3} md={1.9}>
          <TextField select label="Loan officer" size="small" fullWidth value={officer} onChange={(e) => setOfficer(e.target.value)}>
            <MenuItem value="All">All</MenuItem>
            {loanOfficers.map((o) => <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={6} sm={3} md={1.9}>
          <TextField select label="Product" size="small" fullWidth value={product} onChange={(e) => setProduct(e.target.value)}>
            <MenuItem value="All">All</MenuItem>
            {loanProducts.map((p) => <MenuItem key={p.id} value={p.id}>{p.productName}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={6} sm={3} md={1.5}>
          <TextField select label="Status" size="small" fullWidth value={status} onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="All">All</MenuItem>
            {['Pending', 'Active', 'Overdue', 'Completed', 'Written Off', 'Cancelled'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} md={1.6}>
          <TextField select label="Customer" size="small" fullWidth value={customer} onChange={(e) => setCustomer(e.target.value)}>
            <MenuItem value="All">All</MenuItem>
            {customers.map((c) => <MenuItem key={c.id} value={c.id}>{c.fullName}</MenuItem>)}
          </TextField>
        </Grid>
      </Grid>
    </Card>
  )

  const actionBar = (title, headers, rows) => (
    <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mb: 1 }} className="no-print">
      <Button size="small" startIcon={<DownloadIcon />} onClick={() => exportCsv(`${title.replace(/\s+/g, '_').toLowerCase()}.csv`, headers, rows)}>
        Export CSV
      </Button>
      <Button size="small" startIcon={<PrintIcon />} onClick={() => window.print()}>Print</Button>
    </Stack>
  )

  const renderReport = () => {
    switch (REPORTS[tab]) {
      case 'Loan Portfolio': {
        const headers = ['Loan #', 'Customer', 'Product', 'Principal', 'Repayable', 'Outstanding', 'Status']
        const rows = filteredLoans.map((l) => [l.loanNumber, findCustomer(l.customerId)?.fullName, findProduct(l.productId)?.productName, l.principalAmount, l.totalRepayable, outstandingBalance(l), l.status])
        return (
          <>
            {actionBar('Loan Portfolio Report', headers, rows)}
            <ReportTable headers={headers} rows={filteredLoans} render={(l) => (
              <TableRow key={l.id}>
                <TableCell>{l.loanNumber}</TableCell>
                <TableCell>{findCustomer(l.customerId)?.fullName}</TableCell>
                <TableCell>{findProduct(l.productId)?.productName}</TableCell>
                <TableCell>{currency(l.principalAmount)}</TableCell>
                <TableCell>{currency(l.totalRepayable)}</TableCell>
                <TableCell>{currency(outstandingBalance(l))}</TableCell>
                <TableCell><StatusChip status={l.status} /></TableCell>
              </TableRow>
            )} />
          </>
        )
      }
      case 'Active Loans': {
        const activeLoans = filteredLoans.filter((l) => l.status === 'Active')
        const headers = ['Loan #', 'Customer', 'Outstanding', 'Due date']
        const rows = activeLoans.map((l) => [l.loanNumber, findCustomer(l.customerId)?.fullName, outstandingBalance(l), l.dueDate])
        return (
          <>
            {actionBar('Active Loans Report', headers, rows)}
            <ReportTable headers={headers} rows={activeLoans} render={(l) => (
              <TableRow key={l.id}>
                <TableCell>{l.loanNumber}</TableCell>
                <TableCell>{findCustomer(l.customerId)?.fullName}</TableCell>
                <TableCell>{currency(outstandingBalance(l))}</TableCell>
                <TableCell>{l.dueDate}</TableCell>
              </TableRow>
            )} />
          </>
        )
      }
      case 'Completed Loans': {
        const completed = filteredLoans.filter((l) => l.status === 'Completed')
        const headers = ['Loan #', 'Customer', 'Principal', 'Total repaid', 'Start date']
        const rows = completed.map((l) => [l.loanNumber, findCustomer(l.customerId)?.fullName, l.principalAmount, l.amountPaid, l.startDate])
        return (
          <>
            {actionBar('Completed Loans Report', headers, rows)}
            <ReportTable headers={headers} rows={completed} render={(l) => (
              <TableRow key={l.id}>
                <TableCell>{l.loanNumber}</TableCell>
                <TableCell>{findCustomer(l.customerId)?.fullName}</TableCell>
                <TableCell>{currency(l.principalAmount)}</TableCell>
                <TableCell>{currency(l.amountPaid)}</TableCell>
                <TableCell>{l.startDate}</TableCell>
              </TableRow>
            )} />
          </>
        )
      }
      case 'Outstanding Balance': {
        const outstanding = filteredLoans.filter((l) => outstandingBalance(l) > 0)
        const total = outstanding.reduce((sum, l) => sum + outstandingBalance(l), 0)
        const headers = ['Loan #', 'Customer', 'Outstanding balance', 'Status']
        const rows = outstanding.map((l) => [l.loanNumber, findCustomer(l.customerId)?.fullName, outstandingBalance(l), l.status])
        return (
          <>
            {actionBar('Outstanding Balance Report', headers, rows)}
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Total outstanding: {currency(total)}</Typography>
            <ReportTable headers={headers} rows={outstanding} render={(l) => (
              <TableRow key={l.id}>
                <TableCell>{l.loanNumber}</TableCell>
                <TableCell>{findCustomer(l.customerId)?.fullName}</TableCell>
                <TableCell>{currency(outstandingBalance(l))}</TableCell>
                <TableCell><StatusChip status={l.status} /></TableCell>
              </TableRow>
            )} />
          </>
        )
      }
      case 'Repayment Report': {
        const headers = ['Receipt #', 'Customer', 'Date', 'Amount', 'Method']
        const rows = filteredRepayments.map((r) => [r.receiptNumber, findCustomer(r.customerId)?.fullName, r.paymentDate, r.amount, r.paymentMethod])
        const total = filteredRepayments.reduce((sum, r) => sum + r.amount, 0)
        return (
          <>
            {actionBar('Repayment Report', headers, rows)}
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Total collected: {currency(total)}</Typography>
            <ReportTable headers={headers} rows={filteredRepayments} render={(r) => (
              <TableRow key={r.id}>
                <TableCell>{r.receiptNumber}</TableCell>
                <TableCell>{findCustomer(r.customerId)?.fullName}</TableCell>
                <TableCell>{r.paymentDate}</TableCell>
                <TableCell>{currency(r.amount)}</TableCell>
                <TableCell>{r.paymentMethod}</TableCell>
              </TableRow>
            )} />
          </>
        )
      }
      case 'Loan Officer Performance': {
        const list = loanOfficers
          .filter((o) => (officer === 'All' ? true : o.id === officer))
          .filter((o) => (branch === 'All' ? true : o.branch === branch))
          .map((o) => ({ ...o, summary: officerPortfolioSummary(o.id, ctx) }))
          .sort((a, b) => b.summary.portfolioValue - a.summary.portfolioValue)
        const headers = ['Officer', 'Branch', 'Customers', 'Active loans', 'Portfolio value', 'Collected']
        const rows = list.map((o) => [o.name, o.branch, o.summary.assignedCustomers, o.summary.activeLoans, o.summary.portfolioValue, o.summary.totalCollected])
        return (
          <>
            {actionBar('Loan Officer Performance', headers, rows)}
            <ReportTable headers={headers} rows={list} render={(o) => (
              <TableRow key={o.id}>
                <TableCell>{o.name}</TableCell>
                <TableCell>{o.branch}</TableCell>
                <TableCell>{o.summary.assignedCustomers}</TableCell>
                <TableCell>{o.summary.activeLoans}</TableCell>
                <TableCell>{currency(o.summary.portfolioValue)}</TableCell>
                <TableCell>{currency(o.summary.totalCollected)}</TableCell>
              </TableRow>
            )} />
          </>
        )
      }
      case 'Loan Status Report': {
        const statuses = ['Pending', 'Active', 'Overdue', 'Completed', 'Written Off', 'Cancelled']
        const list = statuses.map((s) => ({
          status: s,
          count: filteredLoans.filter((l) => l.status === s).length,
          value: filteredLoans.filter((l) => l.status === s).reduce((sum, l) => sum + l.principalAmount, 0),
        }))
        const headers = ['Status', 'Number of loans', 'Total principal value']
        const rows = list.map((s) => [s.status, s.count, s.value])
        return (
          <>
            {actionBar('Loan Status Report', headers, rows)}
            <ReportTable headers={headers} rows={list} render={(s) => (
              <TableRow key={s.status}>
                <TableCell><StatusChip status={s.status} /></TableCell>
                <TableCell>{s.count}</TableCell>
                <TableCell>{currency(s.value)}</TableCell>
              </TableRow>
            )} />
          </>
        )
      }
      case 'Loan Product Summary': {
        const list = loanProducts
          .filter((p) => (product === 'All' ? true : p.id === product))
          .map((p) => {
            const productLoans = loans.filter((l) => l.productId === p.id)
            return {
              ...p,
              count: productLoans.length,
              value: productLoans.reduce((sum, l) => sum + l.principalAmount, 0),
              outstanding: productLoans.reduce((sum, l) => sum + outstandingBalance(l), 0),
            }
          })
        const headers = ['Product', 'Loans issued', 'Portfolio value', 'Outstanding']
        const rows = list.map((p) => [p.productName, p.count, p.value, p.outstanding])
        return (
          <>
            {actionBar('Loan Product Summary', headers, rows)}
            <ReportTable headers={headers} rows={list} render={(p) => (
              <TableRow key={p.id}>
                <TableCell>{p.productName}</TableCell>
                <TableCell>{p.count}</TableCell>
                <TableCell>{currency(p.value)}</TableCell>
                <TableCell>{currency(p.outstanding)}</TableCell>
              </TableRow>
            )} />
          </>
        )
      }
      default:
        return null
    }
  }

  return (
    <Box>
      <PageHeader title={t('pages.reportsTitle')} subtitle={t('pages.reportsSub')} />
      {filterBar}
      <Card>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="scrollable" scrollButtons="auto" className="no-print">
          {REPORTS.map((r) => <Tab key={r} label={r} />)}
        </Tabs>
        <Divider />
        <CardContent>{renderReport()}</CardContent>
      </Card>
    </Box>
  )
}

function ReportTable({ headers, rows, render }) {
  if (rows.length === 0) return <EmptyState title="No records match these filters" subtitle="" />
  return (
    <Table size="small">
      <TableHead><TableRow>{headers.map((h) => <TableCell key={h}>{h}</TableCell>)}</TableRow></TableHead>
      <TableBody>{rows.map(render)}</TableBody>
    </Table>
  )
}
