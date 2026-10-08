// Simple, deterministic ID / reference-number generators used across the app.
// These are simulation helpers only — no real banking reference schemes.

export const pad = (num, size = 4) => String(num).padStart(size, '0')

export const genCustomerId = (n) => `CUST-${pad(n)}`
export const genOfficerId = (n) => `OFF-${pad(n, 3)}`
export const genProductId = (n) => `PRD-${pad(n, 3)}`
export const genApplicationId = (n) => `APP-2026-${pad(n)}`
export const genLoanId = (n) => `LN-2026-${pad(n)}`
export const genRepaymentId = (n) => `RPY-2026-${pad(n)}`
export const genReceiptNumber = (n) => `RCP-2026-${pad(n)}`
export const genCustomerNumber = (n) => `MFI${pad(n, 6)}`
export const genStaffNumber = (n) => `STF${pad(n, 4)}`
