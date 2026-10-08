// -----------------------------------------------------------------------------
// localStorage persistence layer.
// -----------------------------------------------------------------------------
// All simulated data (customers, applications, loans, repayments, officers,
// products, dashboard settings) is persisted here so that refreshing the
// browser does not remove the student's simulated data, per the assignment
// requirement. There is no server, no database and no real API call.
// -----------------------------------------------------------------------------

import { buildMockDataset } from '../data/mockData.js'

const STORAGE_KEYS = {
  customers: 'mfi.customers',
  loanOfficers: 'mfi.loanOfficers',
  loanProducts: 'mfi.loanProducts',
  loanApplications: 'mfi.loanApplications',
  loans: 'mfi.loans',
  repayments: 'mfi.repayments',
  settings: 'mfi.settings',
  seeded: 'mfi.seeded.v1',
}

function safeGet(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (err) {
    console.error(`Failed to read "${key}" from localStorage`, err)
    return fallback
  }
}

function safeSet(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error(`Failed to write "${key}" to localStorage`, err)
  }
}

// Seeds localStorage with the generated mock dataset the FIRST time the app
// runs on a browser. On every subsequent load, whatever the user has
// added/edited/deleted is loaded instead of regenerating fresh mock data.
export function loadInitialState() {
  const alreadySeeded = window.localStorage.getItem(STORAGE_KEYS.seeded)

  if (!alreadySeeded) {
    const dataset = buildMockDataset()
    safeSet(STORAGE_KEYS.customers, dataset.customers)
    safeSet(STORAGE_KEYS.loanOfficers, dataset.loanOfficers)
    safeSet(STORAGE_KEYS.loanProducts, dataset.loanProducts)
    safeSet(STORAGE_KEYS.loanApplications, dataset.loanApplications)
    safeSet(STORAGE_KEYS.loans, dataset.loans)
    safeSet(STORAGE_KEYS.repayments, dataset.repayments)
    safeSet(STORAGE_KEYS.settings, { theme: 'light', dashboardRangeDays: 30 })
    window.localStorage.setItem(STORAGE_KEYS.seeded, 'true')
    return dataset
  }

  return {
    customers: safeGet(STORAGE_KEYS.customers, []),
    loanOfficers: safeGet(STORAGE_KEYS.loanOfficers, []),
    loanProducts: safeGet(STORAGE_KEYS.loanProducts, []),
    loanApplications: safeGet(STORAGE_KEYS.loanApplications, []),
    loans: safeGet(STORAGE_KEYS.loans, []),
    repayments: safeGet(STORAGE_KEYS.repayments, []),
    settings: safeGet(STORAGE_KEYS.settings, { theme: 'light', dashboardRangeDays: 30 }),
  }
}

export function persist(sliceName, data) {
  const key = STORAGE_KEYS[sliceName]
  if (!key) {
    console.warn(`Unknown storage slice "${sliceName}"`)
    return
  }
  safeSet(key, data)
}

// Wipes all simulated data and re-seeds fresh mock data. Exposed from
// Settings/Reports so a student/demo user can reset the simulation.
export function resetSimulation() {
  Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key))
  return loadInitialState()
}

export { STORAGE_KEYS }
