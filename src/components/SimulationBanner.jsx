import React from 'react'
import { Alert } from '@mui/material'
import { useLanguage } from '../context/LanguageContext.jsx'

// Required visible notice: this app is a frontend simulation only.
export default function SimulationBanner() {
  const { t } = useLanguage()
  return (
    <Alert severity="info" variant="filled" sx={{ borderRadius: 0, justifyContent: 'center', fontSize: 13 }}>
      {t('simulationBanner')}
    </Alert>
  )
}
