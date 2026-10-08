import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box, Typography, TextField, Button, Stack, Avatar, Alert, Collapse,
  IconButton, Menu, MenuItem, Divider, Chip,
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import LoginIcon from '@mui/icons-material/LoginRounded'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LanguageIcon from '@mui/icons-material/Language'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useAuth, DEMO_USERS } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

// Six branch nodes, roughly positioned like Rwanda's provinces, connected to
// a head-office hub — a small, subject-specific decorative motif (the MFI's
// branch network) rather than a generic gradient blob.
const NODES = [
  { id: 'Kigali', x: 230, y: 150, hub: true },
  { id: 'Karongi', x: 70, y: 210 },
  { id: 'Musanze', x: 150, y: 60 },
  { id: 'Huye', x: 190, y: 320 },
  { id: 'Rubavu', x: 40, y: 90 },
  { id: 'Rusizi', x: 60, y: 330 },
]

function BranchNetwork() {
  const hub = NODES.find((n) => n.hub)
  return (
    <svg viewBox="0 0 320 380" width="100%" height="100%" style={{ maxWidth: 320 }}>
      {NODES.filter((n) => !n.hub).map((n, i) => (
        <motion.line
          key={n.id}
          x1={hub.x} y1={hub.y} x2={n.x} y2={n.y}
          stroke="rgba(255,255,255,0.35)" strokeWidth={1.5}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 + i * 0.12, ease: 'easeOut' }}
        />
      ))}
      {NODES.map((n, i) => (
        <motion.g key={n.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: n.hub ? 0.1 : 0.5 + i * 0.12, ease: 'backOut' }}
        >
          <circle cx={n.x} cy={n.y} r={n.hub ? 9 : 5.5} fill={n.hub ? '#01A88D' : '#FFFFFF'} />
          <text x={n.x} y={n.y - 14} fill="rgba(255,255,255,0.85)" fontSize="11" textAnchor="middle">{n.id}</text>
        </motion.g>
      ))}
    </svg>
  )
}

export default function Login() {
  const { login, loginAsDemo } = useAuth()
  const { language, setLanguage, languages, t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [manualOpen, setManualOpen] = useState(false)
  const [langAnchor, setLangAnchor] = useState(null)

  const currentLang = languages.find((l) => l.code === language)

  const handleDemoLogin = (userId) => {
    loginAsDemo(userId)
    navigate(redirectTo, { replace: true })
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    const result = login(username, password)
    if (!result.success) {
      setError(result.message)
      return
    }
    navigate(redirectTo, { replace: true })
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#F4F6F8' }}>
      {/* Hero / brand panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '42%',
          minWidth: 420,
          p: 6,
          background: 'linear-gradient(160deg, #063142 0%, #0B4F6C 55%, #0E5F82 100%)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Avatar sx={{ bgcolor: '#01A88D', width: 34, height: 34, fontSize: 14, fontWeight: 700 }}>MF</Avatar>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>{t('appShortName')}</Typography>
          </Stack>
        </motion.div>

        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', my: 2 }}>
          <BranchNetwork />
        </Box>

        <AnimatePresence mode="wait">
          <motion.div
            key={language}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.25, mb: 1.5 }}>
              {t('appTitle')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', maxWidth: 340 }}>
              {t('login.tagline')}
            </Typography>
          </motion.div>
        </AnimatePresence>

        <Stack direction="row" spacing={3} sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <StatBit value="40" label={t('dashboard.totalCustomers')} />
          <StatBit value="8" label={t('dashboard.loanOfficers')} />
          <StatBit value="6" label={t('pages.productsTitle')} />
        </Stack>
      </Box>

      {/* Sign-in panel */}
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 3, sm: 6 } }}>
        <Box sx={{ width: '100%', maxWidth: 460 }}>
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
            <Button
              size="small"
              startIcon={<LanguageIcon fontSize="small" />}
              onClick={(e) => setLangAnchor(e.currentTarget)}
              sx={{ color: 'text.secondary' }}
            >
              {currentLang.flag} {currentLang.label}
            </Button>
            <Menu anchorEl={langAnchor} open={!!langAnchor} onClose={() => setLangAnchor(null)}>
              {languages.map((l) => (
                <MenuItem key={l.code} selected={l.code === language} onClick={() => { setLanguage(l.code); setLangAnchor(null) }}>
                  {l.flag}&nbsp;&nbsp;{l.label}
                </MenuItem>
              ))}
            </Menu>
          </Stack>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
            <AnimatePresence mode="wait">
              <motion.div key={language} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>{t('login.title')}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{t('login.subtitle')}</Typography>
              </motion.div>
            </AnimatePresence>

            <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 1 }}>
              {t('login.demoAccountsTitle')}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
              {t('login.demoAccountsHint')}
            </Typography>

            <Stack spacing={1.2} sx={{ mb: 3 }}>
              {DEMO_USERS.map((u, i) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
                  whileHover={{ x: 4 }}
                >
                  <Box
                    onClick={() => handleDemoLogin(u.id)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 1.5, p: 1.3, borderRadius: 2,
                      border: '1px solid', borderColor: 'divider', cursor: 'pointer',
                      borderLeft: `4px solid ${u.color}`,
                      transition: 'box-shadow 0.15s, border-color 0.15s',
                      '&:hover': { boxShadow: '0 2px 10px rgba(0,0,0,0.08)', borderColor: u.color },
                    }}
                  >
                    <Avatar sx={{ bgcolor: u.color, width: 38, height: 38, fontSize: 14, fontWeight: 700 }}>{u.initials}</Avatar>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{u.name}</Typography>
                        <Chip label={u.role} size="small" sx={{ height: 20, fontSize: 11, bgcolor: `${u.color}1A`, color: u.color, fontWeight: 600 }} />
                      </Stack>
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                        {u.username} / {u.password}
                      </Typography>
                    </Box>
                    <IconButton size="small" sx={{ color: u.color }}><LoginIcon fontSize="small" /></IconButton>
                  </Box>
                </motion.div>
              ))}
            </Stack>

            <Button
              fullWidth size="small" onClick={() => setManualOpen((o) => !o)}
              endIcon={<ExpandMoreIcon sx={{ transform: manualOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />}
              sx={{ color: 'text.secondary', justifyContent: 'space-between', px: 0 }}
            >
              {t('login.manualTitle')}
            </Button>
            <Collapse in={manualOpen}>
              <Box component="form" onSubmit={handleManualSubmit} sx={{ mt: 2 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Stack spacing={2}>
                  <TextField label={t('login.usernameLabel')} fullWidth size="small" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
                  <TextField label={t('login.passwordLabel')} type="password" fullWidth size="small" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
                  <Button type="submit" variant="contained" startIcon={<LockOutlinedIcon />} sx={{ py: 1 }}>
                    {t('login.signIn')}
                  </Button>
                  <Typography variant="caption" color="text.secondary">{t('login.credentialsHint')}</Typography>
                </Stack>
              </Box>
            </Collapse>

            <Divider sx={{ my: 3 }} />
            <Typography variant="caption" color="text.secondary" align="center" display="block">
              {t('login.footer')}
            </Typography>
          </motion.div>
        </Box>
      </Box>
    </Box>
  )
}

function StatBit({ value, label }) {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>{value}</Typography>
      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)' }}>{label}</Typography>
    </Box>
  )
}
