import React, { useMemo } from 'react'
import { Grid, Card, CardContent, Typography, List, ListItem, ListItemText, Box, Stack, Divider } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import PaidIcon from '@mui/icons-material/PaidOutlined'
import PeopleIcon from '@mui/icons-material/PeopleOutline'
import BadgeIcon from '@mui/icons-material/BadgeOutlined'
import SavingsIcon from '@mui/icons-material/SavingsOutlined'
import StatCard from '../components/StatCard.jsx'
import PageHeader from '../components/PageHeader.jsx'
import EmptyState from '../components/EmptyState.jsx'
import LoanPortfolioChart from '../charts/LoanPortfolioChart.jsx'
import RepaymentTrendChart from '../charts/RepaymentTrendChart.jsx'
import LoanStatusPieChart from '../charts/LoanStatusPieChart.jsx'
import { useAppData } from '../context/AppContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import {
  computeDashboardStats, currency, recentBy, loansRequiringAttention,
  upcomingRepaymentDates, topLoanOfficers, outstandingBalance,
} from '../utils/calculations.js'

// One orchestrated entrance: the stat-card row staggers in together on
// first paint, children ride the shared container's animation.
const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

function ListCard({ title, items, renderItem, emptyText, viewAllTo, viewAllLabel }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{title}</Typography>
          {viewAllTo && (
            <Typography variant="caption" component={RouterLink} to={viewAllTo} sx={{ color: 'primary.main', textDecoration: 'none' }}>
              {viewAllLabel}
            </Typography>
          )}
        </Stack>
        {items.length === 0 ? (
          <EmptyState title={emptyText} subtitle="" />
        ) : (
          <List dense disablePadding>
            {items.map((item, idx) => (
              <React.Fragment key={item.id || idx}>
                <ListItem disableGutters>{renderItem(item)}</ListItem>
                {idx < items.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const ctx = useAppData()
  const { customers, loans, loanApplications, repayments, loanOfficers, loanProducts } = ctx
  const { user } = useAuth()
  const { t } = useLanguage()

  const stats = useMemo(() => computeDashboardStats(ctx), [customers, loans, loanApplications, repayments, loanOfficers])

  const findCustomer = (id) => customers.find((c) => c.id === id)

  const recentApplications = useMemo(() => recentBy(loanApplications, 'applicationDate', 5), [loanApplications])
  const recentLoans = useMemo(
    () => recentBy(loans.filter((l) => l.status !== 'Pending' && l.status !== 'Cancelled'), 'startDate', 5),
    [loans]
  )
  const recentRepayments = useMemo(() => recentBy(repayments, 'paymentDate', 5), [repayments])
  const attention = useMemo(() => loansRequiringAttention(loans).slice(0, 5), [loans])
  const upcoming = useMemo(() => upcomingRepaymentDates(loans, 14).slice(0, 5), [loans])
  const topOfficers = useMemo(() => topLoanOfficers(loanOfficers, ctx, 5), [loanOfficers, customers, loans, repayments])

  const viewAllLabel = t('dashboard.viewAll')

  const statCards = [
    { title: t('dashboard.totalLoans'), value: stats.totalLoans, icon: <AccountBalanceWalletIcon />, color: 'primary.main' },
    { title: t('dashboard.active loan'), value: stats.activeLoans, icon: <CheckCircleIcon />, color: 'success.main' },
    { title: t('dashboard.completedLoans'), value: stats.completedLoans, icon: <DoneAllIcon />, color: 'info.main' },
    { title: t('dashboard.pendingApplications'), value: stats.pendingApplications, icon: <HourglassEmptyIcon />, color: 'warning.main' },
    { title: t('dashboard.outstandingBalance'), value: currency(stats.outstandingTotal), icon: <PaidIcon />, color: 'error.main' },
    { title: t('dashboard.totalCustomers'), value: stats.totalCustomers, icon: <PeopleIcon />, color: 'secondary.main' },
    { title: t('dashboard.loanOfficers'), value: stats.totalOfficers, icon: <BadgeIcon />, color: 'primary.dark' },
    { title: t('dashboard.totalRepayments'), value: currency(stats.totalRepayments), icon: <SavingsIcon />, color: 'success.dark', subtitle: `${t('dashboard.repaymentRate')}: ${stats.repaymentRate}%` },
  ]

  return (
    <Box>
      <PageHeader
        title={`${t('common.welcome')}, ${user?.name?.split(' ')[0] || ''}`}
        subtitle={t('dashboard.subtitle')}
      />

      <Box component={motion.div} variants={gridVariants} initial="hidden" animate="show">
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {statCards.map((c) => (
            <Grid item xs={12} sm={6} md={3} key={c.title} component={motion.div} variants={cardVariants}>
              <StatCard {...c} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <LoanPortfolioChart />
        </Grid>
        <Grid item xs={12} md={4}>
          <RepaymentTrendChart />
        </Grid>
        <Grid item xs={12} md={4}>
          <LoanStatusPieChart />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4}>
          <ListCard
            title={t('dashboard.recentApplications')}
            items={recentApplications}
            emptyText="No applications yet"
            viewAllTo="/applications"
            viewAllLabel={viewAllLabel}
            renderItem={(a) => (
              <ListItemText
                primary={`${findCustomer(a.customerId)?.fullName || 'Unknown'} — ${a.requestedAmount.toLocaleString()}`}
                secondary={a.applicationDate}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <ListCard
            title={t('dashboard.recentLoans')}
            items={recentLoans}
            emptyText="No loans yet"
            viewAllTo="/loans"
            viewAllLabel={viewAllLabel}
            renderItem={(l) => (
              <ListItemText
                primary={`${findCustomer(l.customerId)?.fullName || 'Unknown'} — ${l.principalAmount.toLocaleString()}`}
                secondary={l.startDate}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <ListCard
            title={t('dashboard.recentRepayments')}
            items={recentRepayments}
            emptyText="No repayments yet"
            viewAllTo="/repayments"
            viewAllLabel={viewAllLabel}
            renderItem={(r) => (
              <ListItemText
                primary={`${findCustomer(r.customerId)?.fullName || 'Unknown'} — ${r.amount.toLocaleString()}`}
                secondary={`${r.paymentDate} · ${r.paymentMethod}`}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <ListCard
            title={t('dashboard.attention')}
            items={attention}
            emptyText="Nothing overdue right now"
            viewAllTo="/loans"
            viewAllLabel={viewAllLabel}
            renderItem={(l) => (
              <ListItemText
                primary={`${findCustomer(l.customerId)?.fullName || 'Unknown'} — Due ${l.dueDate}`}
                secondary={`Outstanding: ${currency(outstandingBalance(l))}`}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <ListCard
            title={t('dashboard.upcoming')}
            items={upcoming}
            emptyText="No repayments due in the next 14 days"
            viewAllTo="/loans"
            viewAllLabel={viewAllLabel}
            renderItem={(l) => (
              <ListItemText
                primary={`${findCustomer(l.customerId)?.fullName || 'Unknown'}`}
                secondary={`Due ${l.dueDate} · ${currency(outstandingBalance(l))} remaining`}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <ListCard
            title={t('dashboard.topOfficers')}
            items={topOfficers}
            emptyText="No officers yet"
            viewAllTo="/officers"
            viewAllLabel={viewAllLabel}
            renderItem={(o) => (
              <ListItemText
                primary={o.name}
                secondary={`Portfolio: ${currency(o.summary.portfolioValue)} · ${o.summary.activeLoans} active`}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
