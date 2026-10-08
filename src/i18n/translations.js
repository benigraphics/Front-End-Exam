// -----------------------------------------------------------------------------
// Translation dictionary.
// -----------------------------------------------------------------------------
// Covers the interface "chrome" (navigation, page headers, dashboard,
// common actions, login screen) in three languages, reflecting the branches
// this simulated MFI serves. Record/customer data itself (names, notes, etc.)
// is left as entered — only interface text is translated.
// -----------------------------------------------------------------------------

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
]

export const translations = {
  en: {
    appTitle: 'Microfinance Loan Management Dashboard',
    appShortName: 'MFI Connect',
    simulationBanner: 'FRONTEND SIMULATION — This application does not connect to a real microfinance system and does not process real financial transactions.',

    nav: {
      dashboard: 'Dashboard',
      customers: 'Customers',
      applications: 'Loan Applications',
      loans: 'Loans',
      repayments: 'Repayments',
      officers: 'Loan Officers',
      products: 'Loan Products',
      reports: 'Reports',
      reset: 'Reset Simulation',
      resetSub: 'Clears localStorage',
      logout: 'Log out',
    },

    common: {
      add: 'Add', edit: 'Edit', delete: 'Delete', save: 'Save changes', cancel: 'Cancel',
      view: 'View', search: 'Search', filter: 'Filter', status: 'Status', actions: 'Actions',
      welcome: 'Welcome back', signedInAs: 'Signed in as',
    },

    login: {
      tagline: 'Simulated access for every role in the branch.',
      title: 'Sign in to MFI Connect',
      subtitle: 'This is a frontend simulation — choose a demo account below or sign in manually.',
      usernameLabel: 'Username', passwordLabel: 'Password', signIn: 'Sign in',
      demoAccountsTitle: 'Quick demo sign-in', demoAccountsHint: 'One tap — no password needed.',
      manualTitle: 'Or sign in manually',
      invalid: 'Invalid username or password.',
      credentialsHint: 'Credentials are shown on each card — this is a demo, not a real login.',
      footer: 'Frontend simulation only. No real credentials, customers or funds are involved.',
    },

    dashboard: {
      subtitle: 'Portfolio overview — figures are calculated live from mock data.',
      totalLoans: 'Total Loans', activeLoans: 'Active Loans', completedLoans: 'Completed Loans',
      pendingApplications: 'Pending Applications', outstandingBalance: 'Outstanding Balance',
      totalCustomers: 'Total Customers', loanOfficers: 'Loan Officers', totalRepayments: 'Total Repayments',
      repaymentRate: 'Repayment rate',
      portfolioByProduct: 'Loan Portfolio by Product', repaymentTrend: 'Repayment Trend', statusDistribution: 'Loan Status Distribution',
      recentApplications: 'Recent Loan Applications', recentLoans: 'Recently Approved Loans', recentRepayments: 'Recent Repayments',
      attention: 'Loans Requiring Attention', upcoming: 'Upcoming Repayment Dates', topOfficers: 'Top Loan Officers',
      viewAll: 'View all',
    },

    pages: {
      customersTitle: 'Customers', customersSub: 'customers on record', customersAdd: 'Add customer',
      applicationsTitle: 'Loan Applications', applicationsSub: 'applications on record', applicationsAdd: 'New application',
      loansTitle: 'Loans', loansSub: 'loans in the portfolio',
      repaymentsTitle: 'Repayments', repaymentsSub: 'repayments recorded',
      officersTitle: 'Loan Officers', officersSub: 'officers on staff', officersAdd: 'Add officer',
      productsTitle: 'Loan Products', productsSub: 'products configured', productsAdd: 'Add product',
      reportsTitle: 'Reports', reportsSub: 'Filterable, printable and exportable simulated reports.',
    },
  },

  fr: {
    appTitle: 'Tableau de Bord de Gestion des Prêts de Microfinance',
    appShortName: 'MFI Connect',
    simulationBanner: 'SIMULATION FRONTEND — Cette application ne se connecte à aucun système de microfinance réel et ne traite aucune transaction financière réelle.',

    nav: {
      dashboard: 'Tableau de bord',
      customers: 'Clients',
      applications: 'Demandes de prêt',
      loans: 'Prêts',
      repayments: 'Remboursements',
      officers: 'Agents de crédit',
      products: 'Produits de prêt',
      reports: 'Rapports',
      reset: 'Réinitialiser la simulation',
      resetSub: 'Efface le localStorage',
      logout: 'Déconnexion',
    },

    common: {
      add: 'Ajouter', edit: 'Modifier', delete: 'Supprimer', save: 'Enregistrer', cancel: 'Annuler',
      view: 'Voir', search: 'Rechercher', filter: 'Filtrer', status: 'Statut', actions: 'Actions',
      welcome: 'Content de vous revoir', signedInAs: 'Connecté en tant que',
    },

    login: {
      tagline: 'Accès simulé pour chaque rôle de l\u2019agence.',
      title: 'Connexion à MFI Connect',
      subtitle: 'Ceci est une simulation frontend — choisissez un compte démo ci-dessous ou connectez-vous manuellement.',
      usernameLabel: 'Nom d\u2019utilisateur', passwordLabel: 'Mot de passe', signIn: 'Se connecter',
      demoAccountsTitle: 'Connexion démo rapide', demoAccountsHint: 'Un clic — aucun mot de passe requis.',
      manualTitle: 'Ou connectez-vous manuellement',
      invalid: 'Nom d\u2019utilisateur ou mot de passe invalide.',
      credentialsHint: 'Les identifiants sont affichés sur chaque carte — ceci est une démo, pas une vraie connexion.',
      footer: 'Simulation frontend uniquement. Aucun identifiant, client ou fonds réel n\u2019est impliqué.',
    },

    dashboard: {
      subtitle: 'Aperçu du portefeuille — les chiffres sont calculés en direct à partir de données fictives.',
      totalLoans: 'Total des prêts', activeLoans: 'Prêts actifs', completedLoans: 'Prêts soldés',
      pendingApplications: 'Demandes en attente', outstandingBalance: 'Solde restant dû',
      totalCustomers: 'Total des clients', loanOfficers: 'Agents de crédit', totalRepayments: 'Total des remboursements',
      repaymentRate: 'Taux de remboursement',
      portfolioByProduct: 'Portefeuille de prêts par produit', repaymentTrend: 'Tendance des remboursements', statusDistribution: 'Répartition des statuts de prêt',
      recentApplications: 'Demandes de prêt récentes', recentLoans: 'Prêts récemment approuvés', recentRepayments: 'Remboursements récents',
      attention: 'Prêts nécessitant une attention', upcoming: 'Échéances à venir', topOfficers: 'Meilleurs agents de crédit',
      viewAll: 'Tout voir',
    },

    pages: {
      customersTitle: 'Clients', customersSub: 'clients enregistrés', customersAdd: 'Ajouter un client',
      applicationsTitle: 'Demandes de prêt', applicationsSub: 'demandes enregistrées', applicationsAdd: 'Nouvelle demande',
      loansTitle: 'Prêts', loansSub: 'prêts dans le portefeuille',
      repaymentsTitle: 'Remboursements', repaymentsSub: 'remboursements enregistrés',
      officersTitle: 'Agents de crédit', officersSub: 'agents en poste', officersAdd: 'Ajouter un agent',
      productsTitle: 'Produits de prêt', productsSub: 'produits configurés', productsAdd: 'Ajouter un produit',
      reportsTitle: 'Rapports', reportsSub: 'Rapports simulés filtrables, imprimables et exportables.',
    },
  },

  rw: {
    appTitle: 'Dashboard yo Gucunga Inguzanyo za Mikorofinansi',
    appShortName: 'MFI Connect',
    simulationBanner: 'IYI NI IGERAGEZWA RYA MBERE — Iyi porogaramu ntiyihuza na sisitemu nyayo ya mikorofinansi kandi ntikora ibikorwa by\u2019imari nyabyo.',

    nav: {
      dashboard: 'Ahabanza',
      customers: 'Abakiriya',
      applications: 'Dosiye z\u2019Inguzanyo',
      loans: 'Inguzanyo',
      repayments: 'Kwishyura',
      officers: 'Ababikiriya ba Nguzanyo',
      products: 'Ubwoko bw\u2019Inguzanyo',
      reports: 'Raporo',
      reset: 'Subiza Igeragezwa',
      resetSub: 'Isiba localStorage',
      logout: 'Sohoka',
    },

    common: {
      add: 'Ongeraho', edit: 'Hindura', delete: 'Siba', save: 'Bika impinduka', cancel: 'Hagarika',
      view: 'Reba', search: 'Shakisha', filter: 'Shungura', status: 'Imimerere', actions: 'Ibikorwa',
      welcome: 'Ikaze nanone', signedInAs: 'Winjiye nka',
    },

    login: {
      tagline: 'Kwinjira kw\u2019igeragezwa kuri buri murimo muri Ishami.',
      title: 'Injira muri MFI Connect',
      subtitle: 'Iki ni igeragezwa — hitamo konti y\u2019igeragezwa cyangwa winjire ukoresheje izina n\u2019ijambobanga.',
      usernameLabel: 'Izina ry\u2019ukoresha', passwordLabel: 'Ijambobanga', signIn: 'Injira',
      demoAccountsTitle: 'Kwinjira byihuse', demoAccountsHint: 'Kanda rimwe — nta jambobanga rikenewe.',
      manualTitle: 'Cyangwa winjire wikoresheje',
      invalid: 'Izina cyangwa ijambobanga sibyo.',
      credentialsHint: 'Ibisabwa kugira ngo winjire biri kuri buri karita — iki ni igeragezwa, si ukwinjira nyakuri.',
      footer: 'Iri ni igeragezwa gusa. Nta mafaranga cyangwa abakiriya nyabo bigiramo uruhare.',
    },

    dashboard: {
      subtitle: 'Incamake y\u2019ikofi — imibare ibarwa ako kanya uhereye ku makuru y\u2019igeragezwa.',
      totalLoans: 'Inguzanyo Zose', activeLoans: 'Inguzanyo Zikora', completedLoans: 'Inguzanyo Zarangiye',
      pendingApplications: 'Dosiye Zitegereje', outstandingBalance: 'Amafaranga Asigaye',
      totalCustomers: 'Abakiriya Bose', loanOfficers: 'Ababikiriya ba Nguzanyo', totalRepayments: 'Amafaranga Yishyuwe',
      repaymentRate: 'Igipimo cyo Kwishyura',
      portfolioByProduct: 'Inguzanyo Hakurikijwe Ubwoko', repaymentTrend: 'Imikurire y\u2019Ubwishyu', statusDistribution: 'Imiterere y\u2019Inguzanyo',
      recentApplications: 'Dosiye Nshya', recentLoans: 'Inguzanyo Nshya Zemejwe', recentRepayments: 'Ubwishyu Bwaherutse',
      attention: 'Inguzanyo Zikeneye Kwitabwaho', upcoming: 'Itariki z\u2019Ubwishyu Ziri Hafi', topOfficers: 'Ababikiriya Beza',
      viewAll: 'Reba Byose',
    },

    pages: {
      customersTitle: 'Abakiriya', customersSub: 'abakiriya banditswe', customersAdd: 'Ongeraho umukiriya',
      applicationsTitle: 'Dosiye z\u2019Inguzanyo', applicationsSub: 'dosiye zanditswe', applicationsAdd: 'Dosiye nshya',
      loansTitle: 'Inguzanyo', loansSub: 'inguzanyo ziri mu ikofi',
      repaymentsTitle: 'Kwishyura', repaymentsSub: 'ubwishyu bwanditswe',
      officersTitle: 'Ababikiriya ba Nguzanyo', officersSub: 'ababikiriya bakora', officersAdd: 'Ongeraho umubikiriya',
      productsTitle: 'Ubwoko bw\u2019Inguzanyo', productsSub: 'ubwoko bwateguwe', productsAdd: 'Ongeraho ubwoko',
      reportsTitle: 'Raporo', reportsSub: 'Raporo z\u2019igeragezwa zishobora gushungurwa, gucapwa no kohererezwa.',
    },
  },
}
