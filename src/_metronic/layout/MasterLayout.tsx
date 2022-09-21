import '../../_metronic/assets/sass/INSEE.css'
import React, { useEffect } from 'react'
import { Footer } from './components/Footer'
import { Content } from './components/Content'
import { PageDataProvider, useLayout } from './core'
import { useLocation } from 'react-router-dom'

const MasterLayout: React.FC = ({ children }) => {
  const location = useLocation()
  const { config, classes, attributes } = useLayout()
  return (
    <PageDataProvider>
      {children}
      {/*<Content></Content>
       <Footer /> */}
    </PageDataProvider>
  )
}

export { MasterLayout }
