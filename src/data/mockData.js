// -----------------------------------------------------------------------------
// MOCK DATA GENERATOR
// -----------------------------------------------------------------------------
// Everything in this file is FAKE, generated demonstration data. It is created
// once (on first load) and then persisted to browser localStorage. The
// dashboard is a FRONTEND SIMULATION ONLY: no backend, no database, no real
// core-banking system, no real money.
// -----------------------------------------------------------------------------

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

// --- Small deterministic PRNG so the generated dataset looks the same every
// time node_modules is reinstalled / the app is rebuilt from scratch, while
// still looking "random" to a human. (Simple mulberry32 generator.)
function createRng(seed) {
  let a = seed
  return function rng() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rng = createRng(20261001)
const pick = (arr) => arr[Math.floor(rng() * arr.length)]
const randInt = (min, max) => Math.floor(rng() * (max - min + 1)) + min
const randFloat = (min, max, decimals = 0) => {
  const v = rng() * (max - min) + min
  return Number(v.toFixed(decimals))
}
const addDays = (date, days) => {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}
const fmtDate = (d) => new Date(d).toISOString().slice(0, 10)

// -----------------------------------------------------------------------------
// Reference lists
// -----------------------------------------------------------------------------
export const BRANCHES = ['Karongi', 'Kigali', 'Musanze', 'Huye', 'Rubavu', 'Rusizi']

const MALE_NAMES = ['Jean', 'Eric', 'Patrick', 'Emmanuel', 'Fabrice', 'Olivier', 'Innocent', 'Claude', 'Vincent', 'Alexis', 'Bosco', 'Theogene', 'Aime', 'Gilbert', 'Jean Paul', 'Christian', 'Cyprien', 'Damascene', 'Elie', 'Faustin']
const FEMALE_NAMES = ['Marie', 'Alice', 'Grace', 'Diane', 'Josiane', 'Clemence', 'Solange', 'Aline', 'Chantal', 'Divine', 'Immaculee', 'Yvonne', 'Vestine', 'Odile', 'Beatrice', 'Claudine', 'Providence', 'Esperance', 'Consolee', 'Angelique']
const LAST_NAMES = ['Uwase', 'Mugisha', 'Habimana', 'Niyonzima', 'Ndayisenga', 'Bizimana', 'Uwimana', 'Nkurunziza', 'Mukamana', 'Nsengimana', 'Ntawuruhunga', 'Iradukunda', 'Nzeyimana', 'Twagirayezu', 'Hakizimana', 'Kagabo', 'Mucyo', 'Rugamba', 'Rutagengwa', 'Gasana']
const OCCUPATIONS = ['Farmer', 'Small Trader', 'Shop Owner', 'Tailor', 'Teacher', 'Motorcycle Taxi Operator', 'Carpenter', 'Hairdresser', 'Restaurant Owner', 'Mechanic', 'Poultry Farmer', 'Retailer', 'Mason', 'Welder', 'Boutique Owner']
const STREETS = ['KG 11 Ave', 'KN 4 Rd', 'Lake Kivu Rd', 'Market Street', 'Cyangugu Rd', 'Musanze Byahi', 'Huye Tumba', 'Rubavu Rugerero', 'Kigali Nyabugogo', 'Karongi Bwishyura']

function randomName(gender) {
  const first = gender === 'Male' ? pick(MALE_NAMES) : pick(FEMALE_NAMES)
  return `${first} ${pick(LAST_NAMES)}`
}
function randomPhone() {
  return `07${randInt(2, 9)}${String(randInt(0, 9999999)).padStart(7, '0')}`
}
function randomDOB() {
  const year = randInt(1968, 2004)
  const month = randInt(1, 12)
  const day = randInt(1, 28)
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

// -----------------------------------------------------------------------------
// 1. LOAN PRODUCTS (6)
// -----------------------------------------------------------------------------
export function generateLoanProducts() {
  const defs = [
    { name: 'Business Loan', min: 100000, max: 5000000, rate: 14, duration: '3-24 months', desc: 'Working capital and expansion financing for registered small businesses and traders.' },
    { name: 'Agriculture Loan', min: 50000, max: 3000000, rate: 12, duration: '6-18 months', desc: 'Seasonal financing for crop production, livestock and agro-inputs.' },
    { name: 'Emergency Loan', min: 20000, max: 500000, rate: 18, duration: '1-6 months', desc: 'Fast-disbursed short-term loan for urgent household or medical needs.' },
    { name: 'Education Loan', min: 50000, max: 1500000, rate: 10, duration: '6-36 months', desc: 'Tuition and school-related financing for students and guardians.' },
    { name: 'Salary Loan', min: 30000, max: 1000000, rate: 15, duration: '1-12 months', desc: 'Short-term advance against a customer\'s verified monthly salary.' },
    { name: 'Group Loan', min: 200000, max: 8000000, rate: 13, duration: '6-24 months', desc: 'Joint-liability lending for registered savings and credit groups (VSLA/cooperatives).' },
  ]
  return defs.map((d, i) => ({
    id: genProductId(i + 1),
    productName: d.name,
    minAmount: d.min,
    maxAmount: d.max,
    interestRate: d.rate, // % per annum, flat rate for simulation
    duration: d.duration,
    description: d.desc,
    status: 'Active',
  }))
}

// -----------------------------------------------------------------------------
// 2. LOAN OFFICERS (8)
// -----------------------------------------------------------------------------
export function generateLoanOfficers() {
  const officerSeeds = [
    { name: 'Christian Habimana', gender: 'Male' },
    { name: 'Cyprien Niyonzima', gender: 'Male' },
    { name: 'Grace Uwimana', gender: 'Female' },
    { name: 'Eric Mugisha', gender: 'Male' },
    { name: 'Diane Mukamana', gender: 'Female' },
    { name: 'Patrick Bizimana', gender: 'Male' },
    { name: 'Josiane Iradukunda', gender: 'Female' },
    { name: 'Fabrice Ndayisenga', gender: 'Male' },
  ]
  return officerSeeds.map((o, i) => {
    const branch = BRANCHES[i % BRANCHES.length]
    const first = o.name.split(' ')[0].toLowerCase()
    const last = o.name.split(' ')[1].toLowerCase()
    return {
      id: genOfficerId(i + 1),
      staffNumber: genStaffNumber(i + 1),
      name: o.name,
      gender: o.gender,
      branch,
      phone: randomPhone(),
      email: `${first}.${last}@mficonnect.rw`,
      status: 'Active',
    }
  })
}

// -----------------------------------------------------------------------------
// 3. CUSTOMERS (40)
// -----------------------------------------------------------------------------
export function generateCustomers(officers, count = 40) {
  const customers = []
  for (let i = 1; i <= count; i++) {
    const gender = rng() > 0.48 ? 'Male' : 'Female'
    const officer = pick(officers)
    customers.push({
      id: genCustomerId(i),
      customerNumber: genCustomerNumber(i),
      fullName: randomName(gender),
      gender,
      dateOfBirth: randomDOB(),
      phone: randomPhone(),
      address: `${pick(STREETS)}, ${officer.branch}`,
      occupation: pick(OCCUPATIONS),
      branch: officer.branch,
      loanOfficerId: officer.id,
      status: rng() > 0.12 ? 'Active' : 'Inactive',
      createdAt: fmtDate(addDays('2025-11-01', randInt(0, 300))),
    })
  }
  return customers
}

// -----------------------------------------------------------------------------
// 4. LOAN APPLICATIONS (40)
// -----------------------------------------------------------------------------
const APPLICATION_STATUSES = ['Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Cancelled']
const PURPOSES = ['Stock replenishment', 'Farm inputs', 'Medical emergency', 'School fees', 'Shop renovation', 'Equipment purchase', 'Livestock purchase', 'Working capital', 'Rent payment', 'Business expansion']

export function generateApplications(customers, officers, products, count = 40) {
  const apps = []
  // Weighted distribution across statuses so every status is represented.
  const statusPool = [
    ...Array(6).fill('Draft'),
    ...Array(6).fill('Submitted'),
    ...Array(6).fill('Under Review'),
    ...Array(14).fill('Approved'),
    ...Array(5).fill('Rejected'),
    ...Array(3).fill('Cancelled'),
  ]
  for (let i = 1; i <= count; i++) {
    const customer = pick(customers)
    const officer = officers.find((o) => o.id === customer.loanOfficerId) || pick(officers)
    const product = pick(products)
    const amount = randInt(product.minAmount, product.maxAmount)
    const appDate = addDays('2026-03-01', randInt(0, 200))
    apps.push({
      id: genApplicationId(i),
      customerId: customer.id,
      loanOfficerId: officer.id,
      productId: product.id,
      requestedAmount: amount,
      applicationDate: fmtDate(appDate),
      purpose: pick(PURPOSES),
      duration: pick([3, 6, 9, 12, 18, 24]),
      notes: '',
      status: statusPool[i % statusPool.length],
    })
  }
  return apps
}

// -----------------------------------------------------------------------------
// 5 & 6. LOANS (30) + REPAYMENTS (>=60)
// -----------------------------------------------------------------------------
const LOAN_STATUSES_POOL = [
  ...Array(10).fill('Active'),
  ...Array(4).fill('Overdue'),
  ...Array(9).fill('Completed'),
  ...Array(3).fill('Pending'),
  ...Array(2).fill('Written Off'),
  ...Array(2).fill('Cancelled'),
]

export function generateLoansAndRepayments(customers, officers, products, applications, loanCount = 30) {
  const approvedApps = applications.filter((a) => a.status === 'Approved')
  const loans = []
  const repayments = []
  let receiptSeq = 1
  let repaymentSeq = 1

  for (let i = 1; i <= loanCount; i++) {
    // Prefer to base a loan on an approved application when one is available,
    // otherwise generate an independent (already-disbursed) loan record.
    const app = approvedApps[i - 1]
    const customer = app ? customers.find((c) => c.id === app.customerId) : pick(customers)
    const officer = app
      ? officers.find((o) => o.id === app.loanOfficerId)
      : officers.find((o) => o.id === customer.loanOfficerId) || pick(officers)
    const product = app ? products.find((p) => p.id === app.productId) : pick(products)
    const principal = app ? app.requestedAmount : randInt(product.minAmount, product.maxAmount)
    const durationMonths = app ? app.duration : pick([3, 6, 9, 12, 18, 24])
    const interestRate = product.interestRate
    const totalRepayable = Math.round(principal * (1 + (interestRate / 100) * (durationMonths / 12)))
    const startDate = app ? addDays(app.applicationDate, randInt(1, 5)) : addDays('2026-01-15', randInt(0, 150))
    const dueDate = addDays(startDate, durationMonths * 30)
    const status = LOAN_STATUSES_POOL[i % LOAN_STATUSES_POOL.length]

    // Determine amountPaid based on status.
    let paidRatio
    if (status === 'Completed') paidRatio = 1
    else if (status === 'Pending') paidRatio = 0
    else if (status === 'Cancelled') paidRatio = 0
    else if (status === 'Written Off') paidRatio = randFloat(0, 0.4, 2)
    else if (status === 'Overdue') paidRatio = randFloat(0.1, 0.55, 2)
    else paidRatio = randFloat(0.15, 0.85, 2) // Active

    const amountPaid = Math.round(totalRepayable * paidRatio)

    const loan = {
      id: genLoanId(i),
      loanNumber: genLoanId(i),
      applicationId: app ? app.id : null,
      customerId: customer.id,
      loanOfficerId: officer.id,
      productId: product.id,
      principalAmount: principal,
      interestRate,
      totalRepayable,
      amountPaid,
      startDate: fmtDate(startDate),
      dueDate: fmtDate(dueDate),
      duration: durationMonths,
      status,
    }
    loans.push(loan)

    // Generate repayment history so that repayments sum to amountPaid.
    if (amountPaid > 0) {
      const installments = amountPaid > totalRepayable * 0.6 ? randInt(2, 3) : randInt(1, 2)
      let remainingToAllocate = amountPaid
      let runningPaid = 0
      for (let k = 0; k < installments; k++) {
        const isLast = k === installments - 1
        const portion = isLast ? remainingToAllocate : Math.round(remainingToAllocate / (installments - k) * randFloat(0.7, 1.3, 2))
        const amount = Math.max(1000, Math.min(portion, remainingToAllocate))
        remainingToAllocate -= amount
        runningPaid += amount
        const payDate = addDays(startDate, Math.round(((k + 1) / installments) * randInt(20, durationMonths * 28)))
        repayments.push({
          id: genRepaymentId(repaymentSeq),
          receiptNumber: genReceiptNumber(receiptSeq),
          loanId: loan.id,
          customerId: customer.id,
          loanOfficerId: officer.id,
          paymentDate: fmtDate(payDate),
          amount,
          paymentMethod: pick(['Cash', 'Bank', 'Mobile Money', 'Other']),
          reference: `TXN${randInt(100000, 999999)}`,
          remainingBalance: Math.max(0, totalRepayable - runningPaid),
          status: 'Confirmed',
        })
        receiptSeq++
        repaymentSeq++
        if (remainingToAllocate <= 0) break
      }
    }
  }

  // Ensure at least 60 repayments as required — top up with small extra
  // repayments distributed across loans that already have some history.
  const payableLoans = loans.filter((l) => l.amountPaid > 0 && l.status !== 'Completed')
  while (repayments.length < 60 && payableLoans.length > 0) {
    const loan = pick(payableLoans)
    const smallAmount = randInt(2000, 15000)
    const payDate = addDays(loan.startDate, randInt(5, 200))
    repayments.push({
      id: genRepaymentId(repaymentSeq),
      receiptNumber: genReceiptNumber(receiptSeq),
      loanId: loan.id,
      customerId: loan.customerId,
      loanOfficerId: loan.loanOfficerId,
      paymentDate: fmtDate(payDate),
      amount: smallAmount,
      paymentMethod: pick(['Cash', 'Bank', 'Mobile Money', 'Other']),
      reference: `TXN${randInt(100000, 999999)}`,
      remainingBalance: Math.max(0, loan.totalRepayable - loan.amountPaid),
      status: 'Confirmed',
    })
    receiptSeq++
    repaymentSeq++
  }

  repayments.sort((a, b) => new Date(a.paymentDate) - new Date(b.paymentDate))
  return { loans, repayments, nextReceiptSeq: receiptSeq, nextRepaymentSeq: repaymentSeq }
}

// -----------------------------------------------------------------------------
// Master builder — produces the full, cross-referenced mock dataset.
// -----------------------------------------------------------------------------
export function buildMockDataset() {
  const loanProducts = generateLoanProducts()
  const loanOfficers = generateLoanOfficers()
  const customers = generateCustomers(loanOfficers, 40)
  const loanApplications = generateApplications(customers, loanOfficers, loanProducts, 40)
  const { loans, repayments } = generateLoansAndRepayments(customers, loanOfficers, loanProducts, loanApplications, 30)

  return {
    customers,
    loanOfficers,
    loanProducts,
    loanApplications,
    loans,
    repayments,
  }
}
