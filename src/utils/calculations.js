// -----------------------------------------------------------------------------
// Derived / calculated values.
// -----------------------------------------------------------------------------
// Nothing here is hard-coded — every dashboard figure, report total and
// per-customer/per-officer summary is computed on the fly from the current
// loans/repayments/applications arrays using map(), filter(), find(),
// reduce() and sort(), as required by the assignment.
// -----------------------------------------------------------------------------

export const currency = (value) =>
  new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(value || 0)

export const outstandingBalance = (loan) => Math.max(0, (loan.totalRepayable || 0) - (loan.amountPaid || 0))

export function computeDashboardStats({ customers, loans, loanApplications, repayments, loanOfficers }) {
  const totalLoans = loans.length
  const activeLoans = loans.filter((l) => l.status === 'Active').length
  const completedLoans = loans.filter((l) => l.status === 'Completed').length
  const pendingApplications = loanApplications.filter((a) =>
    ['Submitted', 'Under Review', 'Draft'].includes(a.status)
  ).length
  const outstandingTotal = loans.reduce((sum, l) => sum + outstandingBalance(l), 0)
  const totalRepayments = repayments.reduce((sum, r) => sum + r.amount, 0)
  const totalCustomers = customers.length
  const totalOfficers = loanOfficers.filter((o) => o.status === 'Active').length
  const totalRepayable = loans.reduce((sum, l) => sum + (l.totalRepayable || 0), 0)
  const repaymentRate = totalRepayable > 0 ? Number(((totalRepayments / totalRepayable) * 100).toFixed(1)) : 0

  return {
    totalLoans,
    activeLoans,
    completedLoans,
    pendingApplications,
    outstandingTotal,
    totalCustomers,
    totalOfficers,
    totalRepayments,
    repaymentRate,
  }
}

export function customerLoanSummary(customerId, loans) {
  const customerLoans = loans.filter((l) => l.customerId === customerId)
  return {
    numberOfLoans: customerLoans.length,
    totalBorrowed: customerLoans.reduce((sum, l) => sum + (l.principalAmount || 0), 0),
    outstandingBalance: customerLoans.reduce((sum, l) => sum + outstandingBalance(l), 0),
  }
}

export function officerPortfolioSummary(officerId, { customers, loans, repayments }) {
  const assignedCustomers = customers.filter((c) => c.loanOfficerId === officerId)
  const officerLoans = loans.filter((l) => l.loanOfficerId === officerId)
  const officerRepayments = repayments.filter((r) => r.loanOfficerId === officerId)
  return {
    assignedCustomers: assignedCustomers.length,
    activeLoans: officerLoans.filter((l) => l.status === 'Active').length,
    completedLoans: officerLoans.filter((l) => l.status === 'Completed').length,
    portfolioValue: officerLoans.reduce((sum, l) => sum + (l.principalAmount || 0), 0),
    outstandingBalance: officerLoans.reduce((sum, l) => sum + outstandingBalance(l), 0),
    totalCollected: officerRepayments.reduce((sum, r) => sum + r.amount, 0),
  }
}

export function topLoanOfficers(loanOfficers, ctx, limit = 5) {
  return [...loanOfficers]
    .map((o) => ({ ...o, summary: officerPortfolioSummary(o.id, ctx) }))
    .sort((a, b) => b.summary.portfolioValue - a.summary.portfolioValue)
    .slice(0, limit)
}

export function recentBy(items, dateField, limit = 5) {
  return [...items].sort((a, b) => new Date(b[dateField]) - new Date(a[dateField])).slice(0, limit)
}

export function loansRequiringAttention(loans) {
  const today = new Date()
  return loans.filter((l) => {
    if (l.status === 'Overdue') return true
    if (l.status === 'Active' && new Date(l.dueDate) < today) return true
    return false
  })
}

export function upcomingRepaymentDates(loans, withinDays = 14) {
  const today = new Date()
  const horizon = new Date()
  horizon.setDate(today.getDate() + withinDays)
  return loans
    .filter((l) => ['Active', 'Overdue'].includes(l.status))
    .filter((l) => {
      const due = new Date(l.dueDate)
      return due >= today && due <= horizon
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
}

export function loanStatusDistribution(loans) {
  const statuses = ['Active', 'Completed', 'Pending', 'Overdue', 'Written Off', 'Cancelled']
  return statuses
    .map((status) => ({ name: status, value: loans.filter((l) => l.status === status).length }))
    .filter((entry) => entry.value > 0)
}

export function loanPortfolioByProduct(loans, loanProducts) {
  return loanProducts.map((p) => {
    const productLoans = loans.filter((l) => l.productId === p.id)
    return {
      name: p.productName,
      portfolioValue: productLoans.reduce((sum, l) => sum + l.principalAmount, 0),
      outstanding: productLoans.reduce((sum, l) => sum + outstandingBalance(l), 0),
    }
  })
}

export function repaymentTrend(repayments) {
  // Group repayments by month (YYYY-MM) and sum amounts, using reduce().
  const grouped = repayments.reduce((acc, r) => {
    const key = r.paymentDate.slice(0, 7)
    acc[key] = (acc[key] || 0) + r.amount
    return acc
  }, {})
  return Object.keys(grouped)
    .sort()
    .map((month) => ({ month, amount: grouped[month] }))
}
