import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { loadInitialState, persist, resetSimulation } from '../utils/storage.js'
import { outstandingBalance } from '../utils/calculations.js'
import {
  genCustomerId,
  genOfficerId,
  genProductId,
  genApplicationId,
  genLoanId,
  genRepaymentId,
  genReceiptNumber,
  genCustomerNumber,
  genStaffNumber,
} from '../utils/idGenerators.js'

const AppContext = createContext(null)

const nextSeq = (items, prefixLength) =>
  items.reduce((max, item) => {
    const num = parseInt(String(item.id).slice(-prefixLength), 10)
    return Number.isFinite(num) && num > max ? num : max
  }, 0) + 1

export function AppProvider({ children }) {
  const [initial] = useState(() => loadInitialState())

  const [customers, setCustomers] = useState(initial.customers)
  const [loanOfficers, setLoanOfficers] = useState(initial.loanOfficers)
  const [loanProducts, setLoanProducts] = useState(initial.loanProducts)
  const [loanApplications, setLoanApplications] = useState(initial.loanApplications)
  const [loans, setLoans] = useState(initial.loans)
  const [repayments, setRepayments] = useState(initial.repayments)
  const [settings, setSettings] = useState(initial.settings)

  const [toast, setToast] = useState(null) // { message, severity }

  const notify = useCallback((message, severity = 'success') => {
    setToast({ message, severity, key: Date.now() })
  }, [])

  // Persist every slice whenever it changes — this is the localStorage
  // requirement: refreshing the browser must not remove simulated data.
  useEffect(() => persist('customers', customers), [customers])
  useEffect(() => persist('loanOfficers', loanOfficers), [loanOfficers])
  useEffect(() => persist('loanProducts', loanProducts), [loanProducts])
  useEffect(() => persist('loanApplications', loanApplications), [loanApplications])
  useEffect(() => persist('loans', loans), [loans])
  useEffect(() => persist('repayments', repayments), [repayments])
  useEffect(() => persist('settings', settings), [settings])

  // ---------------------------------------------------------------------
  // CUSTOMERS
  // ---------------------------------------------------------------------
  const addCustomer = useCallback((data) => {
    setCustomers((prev) => {
      const seq = nextSeq(prev, 4) || prev.length + 1
      const customer = {
        id: genCustomerId(seq),
        customerNumber: genCustomerNumber(seq),
        status: 'Active',
        createdAt: new Date().toISOString().slice(0, 10),
        ...data,
      }
      return [...prev, customer]
    })
    notify('Customer added successfully.')
  }, [notify])

  const updateCustomer = useCallback((id, data) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)))
    notify('Customer updated successfully.')
  }, [notify])

  const deleteCustomer = useCallback((id) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id))
    notify('Customer deleted.', 'info')
  }, [notify])

  // ---------------------------------------------------------------------
  // LOAN OFFICERS
  // ---------------------------------------------------------------------
  const addLoanOfficer = useCallback((data) => {
    setLoanOfficers((prev) => {
      const seq = nextSeq(prev, 3) || prev.length + 1
      const officer = { id: genOfficerId(seq), staffNumber: genStaffNumber(seq), status: 'Active', ...data }
      return [...prev, officer]
    })
    notify('Loan officer added successfully.')
  }, [notify])

  const updateLoanOfficer = useCallback((id, data) => {
    setLoanOfficers((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)))
    notify('Loan officer updated successfully.')
  }, [notify])

  const deleteLoanOfficer = useCallback((id) => {
    setLoanOfficers((prev) => prev.filter((o) => o.id !== id))
    notify('Loan officer deleted.', 'info')
  }, [notify])

  // ---------------------------------------------------------------------
  // LOAN PRODUCTS
  // ---------------------------------------------------------------------
  const addLoanProduct = useCallback((data) => {
    setLoanProducts((prev) => {
      const seq = nextSeq(prev, 3) || prev.length + 1
      return [...prev, { id: genProductId(seq), status: 'Active', ...data }]
    })
    notify('Loan product added successfully.')
  }, [notify])

  const updateLoanProduct = useCallback((id, data) => {
    setLoanProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
    notify('Loan product updated successfully.')
  }, [notify])

  const deleteLoanProduct = useCallback((id) => {
    setLoanProducts((prev) => prev.filter((p) => p.id !== id))
    notify('Loan product deleted.', 'info')
  }, [notify])

  // ---------------------------------------------------------------------
  // LOAN APPLICATIONS + WORKFLOW
  // ---------------------------------------------------------------------
  const addApplication = useCallback((data) => {
    setLoanApplications((prev) => {
      const seq = nextSeq(prev, 4) || prev.length + 1
      const application = {
        id: genApplicationId(seq),
        applicationDate: new Date().toISOString().slice(0, 10),
        status: 'Submitted',
        notes: '',
        ...data,
      }
      return [...prev, application]
    })
    notify('Loan application created.')
  }, [notify])

  const updateApplication = useCallback((id, data) => {
    setLoanApplications((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)))
    notify('Loan application updated.')
  }, [notify])

  // Approving an application creates the corresponding simulated loan and
  // flips the application status — this is the core workflow transition
  // required by the assignment brief.
  const approveApplication = useCallback((applicationId) => {
    setLoanApplications((prevApps) => {
      const app = prevApps.find((a) => a.id === applicationId)
      if (!app) return prevApps

      setLoans((prevLoans) => {
        const seq = nextSeq(prevLoans, 4) || prevLoans.length + 1
        const product = loanProducts.find((p) => p.id === app.productId)
        const rate = product ? product.interestRate : 15
        const totalRepayable = Math.round(app.requestedAmount * (1 + (rate / 100) * (app.duration / 12)))
        const startDate = new Date().toISOString().slice(0, 10)
        const due = new Date()
        due.setDate(due.getDate() + app.duration * 30)
        const loan = {
          id: genLoanId(seq),
          loanNumber: genLoanId(seq),
          applicationId: app.id,
          customerId: app.customerId,
          loanOfficerId: app.loanOfficerId,
          productId: app.productId,
          principalAmount: app.requestedAmount,
          interestRate: rate,
          totalRepayable,
          amountPaid: 0,
          startDate,
          dueDate: due.toISOString().slice(0, 10),
          duration: app.duration,
          status: 'Active',
        }
        return [...prevLoans, loan]
      })

      notify(`Application ${applicationId} approved and loan created.`)
      return prevApps.map((a) => (a.id === applicationId ? { ...a, status: 'Approved' } : a))
    })
  }, [loanProducts, notify])

  const rejectApplication = useCallback((applicationId, reason = '') => {
    setLoanApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status: 'Rejected', notes: reason || a.notes } : a))
    )
    notify('Application rejected.', 'warning')
  }, [notify])

  // ---------------------------------------------------------------------
  // REPAYMENTS (with full validation + workflow side-effects)
  // ---------------------------------------------------------------------
  const recordRepayment = useCallback((loanId, { amount, paymentDate, paymentMethod, reference }) => {
    const loan = loans.find((l) => l.id === loanId)
    if (!loan) {
      notify('Loan not found.', 'error')
      return { success: false, message: 'Loan not found.' }
    }
    const remaining = outstandingBalance(loan)
    if (!amount || amount <= 0) {
      return { success: false, message: 'Repayment amount must be greater than zero.' }
    }
    if (amount > remaining) {
      return { success: false, message: `Amount exceeds the outstanding balance of ${remaining.toLocaleString()}.` }
    }

    const newAmountPaid = loan.amountPaid + amount
    const newOutstanding = loan.totalRepayable - newAmountPaid
    const newStatus = newOutstanding <= 0 ? 'Completed' : loan.status === 'Pending' ? 'Active' : loan.status

    setLoans((prev) =>
      prev.map((l) => (l.id === loanId ? { ...l, amountPaid: newAmountPaid, status: newStatus } : l))
    )

    setRepayments((prev) => {
      const seq = nextSeq(prev, 4) || prev.length + 1
      const repayment = {
        id: genRepaymentId(seq),
        receiptNumber: genReceiptNumber(seq),
        loanId,
        customerId: loan.customerId,
        loanOfficerId: loan.loanOfficerId,
        paymentDate: paymentDate || new Date().toISOString().slice(0, 10),
        amount,
        paymentMethod,
        reference: reference || `TXN${Math.floor(100000 + Math.random() * 900000)}`,
        remainingBalance: Math.max(0, newOutstanding),
        status: 'Confirmed',
      }
      return [...prev, repayment]
    })

    notify(`Repayment recorded. ${newStatus === 'Completed' ? 'Loan fully paid off!' : ''}`)
    return { success: true }
  }, [loans, notify])

  // ---------------------------------------------------------------------
  // RESET SIMULATION
  // ---------------------------------------------------------------------
  const resetAll = useCallback(() => {
    const fresh = resetSimulation()
    setCustomers(fresh.customers)
    setLoanOfficers(fresh.loanOfficers)
    setLoanProducts(fresh.loanProducts)
    setLoanApplications(fresh.loanApplications)
    setLoans(fresh.loans)
    setRepayments(fresh.repayments)
    setSettings(fresh.settings)
    notify('Simulation data has been reset.', 'info')
  }, [notify])

  const value = useMemo(
    () => ({
      customers,
      loanOfficers,
      loanProducts,
      loanApplications,
      loans,
      repayments,
      settings,
      setSettings,
      toast,
      setToast,
      notify,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addLoanOfficer,
      updateLoanOfficer,
      deleteLoanOfficer,
      addLoanProduct,
      updateLoanProduct,
      deleteLoanProduct,
      addApplication,
      updateApplication,
      approveApplication,
      rejectApplication,
      recordRepayment,
      resetAll,
    }),
    [
      customers,
      loanOfficers,
      loanProducts,
      loanApplications,
      loans,
      repayments,
      settings,
      toast,
      notify,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addLoanOfficer,
      updateLoanOfficer,
      deleteLoanOfficer,
      addLoanProduct,
      updateLoanProduct,
      deleteLoanProduct,
      addApplication,
      updateApplication,
      approveApplication,
      rejectApplication,
      recordRepayment,
      resetAll,
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppData must be used within an AppProvider')
  return ctx
}
