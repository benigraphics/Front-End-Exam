# Microfinance Loan Management Dashboard

A **frontend-only** simulation of a microfinance institution's loan management
system, built with **React.js**, **Vite**, **Material UI (MUI)** and
**Recharts**. It uses only **mock data** and the browser's **localStorage** —
there is no backend, no database, no payment gateway and no connection to any
real core-banking system or external API.

> **FRONTEND SIMULATION** — This application does not connect to a real
> microfinance system and does not process real financial transactions. All
> customers, loans, repayments and figures shown are fake demonstration data.

---

## 1. Project Description

A microfinance institution wants a modern web dashboard for monitoring
customers, loan applications, active loans, repayments, loan officers and
portfolio performance. This project implements that dashboard as a
**frontend-only React.js simulation**, covering the full loan lifecycle:

`Create Customer → Create Loan Application → Submit Application → Review →
Approve/Reject → Create Loan → Record Repayment → Update Loan Balance →
Complete Loan → Update Dashboard/Reports`

## 2. Technologies Used

| Technology | Purpose |
|---|---|
| React.js (18) | Component-based UI |
| Vite | Dev server & build tool |
| JavaScript ES6+ | Application logic |
| React Router (v6) | Client-side routing, incl. dynamic routes |
| Material UI (MUI) v6 | UI components & theming |
| MUI X DataGrid | Sortable/filterable data tables |
| Recharts | Bar, Line and Pie charts |
| Framer Motion | Login, dashboard and page-transition animation |
| HTML5 / CSS3 | Markup & print stylesheet |
| Browser `localStorage` | Client-side persistence |

## 3. Installation Instructions

Requires **Node.js 18+** and npm.

```bash
# 1. Unzip the project, then move into it
cd microfinance-loan-management-dashboard

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev
```

Vite will print a local URL (typically `http://localhost:5173`) — open it in
your browser.

## 4. How to Run the Project

- **Development:** `npm run dev` — starts the Vite dev server with hot reload.
- **Production build:** `npm run build` — outputs an optimized build to `dist/`.
- **Preview production build:** `npm run preview`.

On first load, the app automatically **seeds** browser `localStorage` with a
full mock dataset (customers, officers, products, applications, loans,
repayments). Refreshing the browser will **not** erase your data — everything
you add, edit or delete is persisted. Use **Reset Simulation** in the left
sidebar to wipe local data and reseed fresh mock data at any time.

## 5. Demo Login & Roles

The app now opens on a **sign-in screen** (`/login`). This is a simulated,
frontend-only login — there is no backend and no real authentication — but it
demonstrates role-based access for every user type the brief requires. Click
any demo account card for instant one-tap sign-in, or expand **"Or sign in
manually"** and type the credentials yourself:

| Role | Username | Password | Represents |
|---|---|---|---|
| Administrator | `admin` | `admin123` | Full access across the whole system |
| Branch Manager | `manager` | `manager123` | Approves/rejects applications, oversees a branch |
| Loan Officer | `officer` | `officer123` | Manages assigned customers and repayments |
| Teller / Cashier | `teller` | `teller123` | Front-desk repayment collection |

The signed-in user's name, role and avatar appear in the top bar, with a
**Log out** option. The session is kept in `localStorage` so refreshing the
page keeps you signed in; logging out (or clearing the browser) returns you
to the login screen. All app routes are protected and redirect to `/login`
when no one is signed in.

## 6. Language Switcher

A language menu (flag + name) sits in the top bar and on the login screen,
switching the interface chrome — navigation, dashboard, page headers, login
text — between **English**, **Français** and **Kinyarwanda**, with an
animated fade/slide transition on every switch (see `src/i18n/translations.js`
and `src/context/LanguageContext.jsx`). The selected language is remembered
in `localStorage`. Record data you enter yourself (customer names, notes,
etc.) is always shown exactly as typed — only interface labels are translated.

## 7. Interface & Motion

Built with Material UI on a dedicated teal/green theme (`src/theme.js`) and
[Framer Motion](https://www.framer.com/motion/) for a small set of
deliberate, non-distracting animations:

- **Login screen** — an animated branch-network diagram (the 6 simulated
  branches connecting to Head Office) draws itself in, demo account cards
  stagger into view, and language switches cross-fade the hero text.
- **Dashboard** — the 8 stat cards stagger in together on load and lift
  slightly on hover.
- **Page navigation** — every route change gets one small, consistent
  fade + rise transition instead of a hard cut (`src/components/PageTransition.jsx`).

## 8. Main Features

### Dashboard
Live summary cards (Total Loans, Active Loans, Completed Loans, Pending
Applications, Outstanding Balance, Total Customers, Loan Officers, Total
Repayments) plus recent applications, recently approved loans, recent
repayments, loans requiring attention, top loan officers and upcoming
repayment dates. Three Recharts visualizations: loan portfolio by product
(bar), repayment trend (line) and loan status distribution (pie).

### Customers
Full CRUD (add / edit / delete), search, filter by branch/status/loan
officer, sorting via the data grid, and a dynamic detail route
(`/customers/:customerId`) showing personal details, derived loan summary,
applications, loans and repayment history.

### Loan Applications
Create, edit, view, search and filter applications by status/customer/
officer. Approve or reject a submitted/under-review application — **approving
an application automatically creates the corresponding active loan**, which
is the core workflow transition of the simulation.

### Loans
Full loan portfolio with search, filters, sorting, a repayment progress bar,
status indicators and a dynamic detail route (`/loans/:loanId`) with full
repayment history and a "Record repayment" action.

### Repayments
A searchable, filterable ledger of every simulated repayment, including
receipt number, method and resulting remaining balance.

### Loan Officers
Full CRUD, search, filter by branch, and a detail page showing assigned
customers, managed loans, recent repayments collected and a portfolio
summary — all computed dynamically.

### Loan Products
CRUD for the six loan products (Business, Agriculture, Emergency, Education,
Salary, Group), each with amount range, interest rate, duration and a live
count of loans issued against it.

### Reports
Eight report types (Loan Portfolio, Active Loans, Completed Loans,
Outstanding Balance, Repayment Report, Loan Officer Performance, Loan Status
Report, Loan Product Summary), filterable by date, branch, loan officer,
product, status and customer, with **Print** and **simulated CSV export**.

## 9. Mock Data Explanation

All mock data is generated in `src/data/mockData.js` using a seeded
pseudo-random generator so the dataset is realistic and internally
consistent, then persisted to `localStorage` on first run:

- **40 customers** — spread across 6 branches, each assigned a loan officer.
- **8 loan officers** — one primary officer per branch (plus overlap).
- **6 loan products** — Business, Agriculture, Emergency, Education, Salary
  and Group loans, each with its own amount range, interest rate and duration.
- **40 loan applications** — statuses distributed across Draft, Submitted,
  Under Review, Approved, Rejected and Cancelled.
- **30 loans** — generated primarily from Approved applications (so
  customer/officer/product/amount stay consistent with a real application),
  with statuses spread across Pending, Active, Overdue, Completed, Written
  Off and Cancelled.
- **60+ repayments** — generated against loans so that the sum of each loan's
  repayments equals its recorded `amountPaid`, spread across Cash, Bank,
  Mobile Money and Other payment methods, with sequential simulated receipt
  numbers (`RCP-2026-00001`, …).

All amounts are in a fictional currency notation (RWF) purely for
demonstration and **do not represent real money**.

## 10. Loan / Repayment Calculation Rules

Nothing is hard-coded — every figure is derived with JavaScript array
methods (`map`, `filter`, `find`, `reduce`, `sort`) in
`src/utils/calculations.js`:

```
Outstanding Balance   = Total Repayable − Amount Paid
Total Loans           = loans.length
Active Loans          = loans.filter(status === 'Active').length
Completed Loans       = loans.filter(status === 'Completed').length
Outstanding (overall) = loans.reduce(sum of outstanding balances)
Total Repaid          = repayments.reduce(sum of amounts)
Repayment Rate        = Total Repaid ÷ Total Repayable × 100
```

**Recording a repayment** (`recordRepayment` in `AppContext.jsx`) performs, in
order:
1. Validates the amount is a positive number.
2. Rejects amounts greater than the loan's current outstanding balance.
3. Increases the loan's `amountPaid`.
4. Recomputes the outstanding balance.
5. Marks the loan `Completed` once fully paid (or `Active` if it was still
   `Pending`).
6. Appends a new entry to the repayment history with a generated receipt
   number (`RCP-2026-####`).
7. Updates dashboard statistics (they are derived live, so this is automatic).
8. Persists everything to `localStorage`.

**Approving an application** (`approveApplication`) creates a new `Active`
loan from the application's customer, officer, product, amount and duration,
computes `totalRepayable` from the product's interest rate, and flips the
application's status to `Approved`.

## 11. React Requirements Demonstrated

Functional components, props, `useState`, `useEffect`, `useMemo`, event
handling, conditional rendering, lists & keys, controlled forms, form
validation, React Router with dynamic routes (`/customers/:customerId`,
`/loans/:loanId`, `/officers/:officerId`), search & filtering, derived state,
reusable components (`StatCard`, `StatusChip`, `ConfirmDialog`, `PageHeader`,
`EmptyState`) and reusable dialogs (Customer/Application/Officer/Product/
Repayment form dialogs), plus `localStorage` persistence via a custom
`AppContext` provider, a demo `AuthContext` (role-based simulated login,
protected routes, `useAuth`) and a `LanguageContext` (`useLanguage`/`t()`)
for the EN/FR/RW interface translations.

## 12. Screenshots

Screenshots are not bundled with the source (this is a code deliverable).
After running `npm install && npm run dev`, capture screenshots of each page
listed below and place them in the `screenshots/` folder for submission:

- `00-login.png` (and one with the language menu open)
- `01-dashboard.png`
- `02-customers.png`
- `03-customer-detail.png`
- `04-loan-applications.png`
- `05-loans.png`
- `06-loan-detail.png`
- `07-repayments.png`
- `08-loan-officers.png`
- `09-loan-products.png`
- `10-reports.png`

## 13. Future Improvements

- Add authentication/role simulation (Admin, Loan Officer, Branch Manager).
- Add a settings page for dashboard preferences (already scaffolded in
  `localStorage` under `mfi.settings`).
- Add pagination-aware CSV export for very large simulated datasets.
- Add unit tests (Vitest + React Testing Library) for calculation utilities.
- Add dark mode toggle using the existing MUI theme structure.

## Project Structure

```
src/
  components/        Reusable UI (StatCard, StatusChip, Layout, PageTransition, ProtectedRoute, ...)
  components/dialogs/ Reusable CRUD form dialogs
  charts/            Recharts components (bar, line, pie)
  context/           AppContext (data/CRUD), AuthContext (demo login), LanguageContext (i18n)
  data/              Mock data generator
  i18n/              translations.js — EN/FR/RW dictionary
  pages/             One file per route/page, incl. Login.jsx
  utils/             calculations.js, storage.js, idGenerators.js
```

## Deliverables Checklist

- [x] Complete React.js source code
- [x] `package.json`
- [x] README documentation (this file)
- [x] Mock data (`src/data/mockData.js`)
- [ ] Screenshots (capture after running locally — see Section 12)
- [x] Responsive interface (MUI breakpoints throughout)
- [x] Recharts dashboards (bar, line, pie)
- [x] LocalStorage implementation (`src/utils/storage.js`)
- [x] Working loan application workflow (submit → review → approve/reject → loan)
- [x] Working simulated repayment workflow (validate → apply → update → history)
- [x] Demo login for all required user roles (`src/context/AuthContext.jsx`)
- [x] Language switcher with animated transitions (EN / FR / RW)
- [ ] Project demonstration (live walkthrough by the student)

---
*Module: ITLDF601 — Frontend Development · RP Karongi College · TVET Certificate VI in Information Technology.*
