import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar, Toolbar, Typography, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Box, IconButton, Snackbar, Alert, Divider, useMediaQuery, Avatar, Stack, Tooltip, Menu, MenuItem,
  Chip, Button,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/DashboardOutlined'
import PeopleIcon from '@mui/icons-material/PeopleOutline'
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined'
import AccountBalanceIcon from '@mui/icons-material/AccountBalanceOutlined'
import PaymentsIcon from '@mui/icons-material/PaymentsOutlined'
import BadgeIcon from '@mui/icons-material/BadgeOutlined'
import CategoryIcon from '@mui/icons-material/CategoryOutlined'
import AssessmentIcon from '@mui/icons-material/AssessmentOutlined'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import LanguageIcon from '@mui/icons-material/Language'
import LogoutIcon from '@mui/icons-material/Logout'
import SimulationBanner from './SimulationBanner.jsx'
import PageTransition from './PageTransition.jsx'
import { useAppData } from '../context/AppContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'

const DRAWER_WIDTH = 250

export default function Layout() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [langAnchor, setLangAnchor] = useState(null)
  const [userAnchor, setUserAnchor] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { toast, setToast, resetAll } = useAppData()
  const { user, logout } = useAuth()
  const { t, language, setLanguage, languages } = useLanguage()

  const NAV_ITEMS = [
    { label: t('nav.dashboard'), path: '/', icon: <DashboardIcon /> },
    { label: t('nav.customers'), path: '/customers', icon: <PeopleIcon /> },
    { label: t('nav.applications'), path: '/applications', icon: <AssignmentIcon /> },
    { label: t('nav.loans'), path: '/loans', icon: <AccountBalanceIcon /> },
    { label: t('nav.repayments'), path: '/repayments', icon: <PaymentsIcon /> },
    { label: t('nav.officers'), path: '/officers', icon: <BadgeIcon /> },
    { label: t('nav.products'), path: '/products', icon: <CategoryIcon /> },
    { label: t('nav.reports'), path: '/reports', icon: <AssessmentIcon /> },
  ]

  const currentLang = languages.find((l) => l.code === language)

  const handleLogout = () => {
    setUserAnchor(null)
    logout()
    navigate('/login', { replace: true })
  }

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: 14 }}>MF</Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
          {t('appShortName')}
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {NAV_ITEMS.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => {
              navigate(item.path)
              if (!isDesktop) setMobileOpen(false)
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={() => setResetOpen(true)}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <RestartAltIcon />
          </ListItemIcon>
          <ListItemText primary={t('nav.reset')} secondary={t('nav.resetSub')} />
        </ListItemButton>
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, ml: { md: `${DRAWER_WIDTH}px` } }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" sx={{ mr: 2, display: { md: 'none' } }} onClick={() => setMobileOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontSize: { xs: 16, sm: 20 } }}>
            {t('appTitle')}
          </Typography>

          <Tooltip title="Language">
            <Button
              onClick={(e) => setLangAnchor(e.currentTarget)}
              sx={{ color: 'inherit', minWidth: 0, mr: 1, textTransform: 'none' }}
              startIcon={<LanguageIcon />}
            >
              <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>{currentLang.flag} {currentLang.label}</Box>
            </Button>
          </Tooltip>
          <Menu anchorEl={langAnchor} open={!!langAnchor} onClose={() => setLangAnchor(null)}>
            {languages.map((l) => (
              <MenuItem key={l.code} selected={l.code === language} onClick={() => { setLanguage(l.code); setLangAnchor(null) }}>
                {l.flag}&nbsp;&nbsp;{l.label}
              </MenuItem>
            ))}
          </Menu>

          <Tooltip title={t('common.signedInAs') + ': ' + (user?.name || '')}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ cursor: 'pointer' }} onClick={(e) => setUserAnchor(e.currentTarget)}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: user?.color || 'secondary.main', fontSize: 13, fontWeight: 700 }}>
                {user?.initials || '?'}
              </Avatar>
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.1 }}>{user?.name}</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)' }}>{user?.role}</Typography>
              </Box>
            </Stack>
          </Tooltip>
          <Menu anchorEl={userAnchor} open={!!userAnchor} onClose={() => setUserAnchor(null)}>
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{user?.name}</Typography>
              <Chip label={user?.role} size="small" sx={{ mt: 0.5, bgcolor: `${user?.color}1A`, color: user?.color, fontWeight: 600 }} />
            </Box>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              {t('nav.logout')}
            </MenuItem>
          </Menu>
        </Toolbar>
        <SimulationBanner />
      </AppBar>

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Toolbar />
        <Box sx={{ height: 32 }} />
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </Box>
      </Box>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={toast?.severity || 'success'} onClose={() => setToast(null)} variant="filled" sx={{ width: '100%' }}>
          {toast?.message}
        </Alert>
      </Snackbar>

      <ConfirmDialog
        open={resetOpen}
        title="Reset simulation data?"
        message="This clears all customers, applications, loans, repayments and officers stored in this browser and reloads fresh mock data. This cannot be undone."
        confirmLabel="Reset"
        onConfirm={resetAll}
        onClose={() => setResetOpen(false)}
      />
    </Box>
  )
}
