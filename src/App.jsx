import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Customers from './pages/Customers.jsx'
import CustomerDetail from './pages/CustomerDetail.jsx'
import LoanApplications from './pages/LoanApplications.jsx'
import Loans from './pages/Loans.jsx'
import LoanDetail from './pages/LoanDetail.jsx'
import Repayments from './pages/Repayments.jsx'
import LoanOfficers from './pages/LoanOfficers.jsx'
import OfficerDetail from './pages/OfficerDetail.jsx'
import LoanProducts from './pages/LoanProducts.jsx'
import Reports from './pages/Reports.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:customerId" element={<CustomerDetail />} />
        <Route path="/applications" element={<LoanApplications />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/loans/:loanId" element={<LoanDetail />} />
        <Route path="/repayments" element={<Repayments />} />
        <Route path="/officers" element={<LoanOfficers />} />
        <Route path="/officers/:officerId" element={<OfficerDetail />} />
        <Route path="/products" element={<LoanProducts />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
