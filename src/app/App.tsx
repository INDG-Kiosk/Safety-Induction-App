import React, { Suspense, useState, useEffect } from 'react'
import { BrowserRouter, Redirect } from 'react-router-dom'
import { I18nProvider } from '../_metronic/i18n/i18nProvider'
import { LayoutProvider, LayoutSplashScreen } from '../_metronic/layout/core'
import AuthInit from './modules/auth/redux/AuthInit'
import { Routes } from './routing/Routes'
import { useTranslation } from "react-i18next";
import { PINGTIMEOUT } from '../app/ui/Common'
import { useDataLayerValue } from '../DataLayer'
import axios from 'axios'

type Props = {
  basename: string
}

const App: React.FC<Props> = ({ basename }) => {

  const { t, i18n, ready } = useTranslation();
  const [{ site }, dispatch] = useDataLayerValue();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (site === undefined || site === '') {
      setTimeout(() => {
        setLoading(true)
        axios({
          method: 'get',
          url:
            process.env.REACT_APP_INSEE_KIOSK_BACKEND_API +
            '/api/sites/' +
            process.env.REACT_APP_INSEE_KIOSK_BACKEND_SITE_CODE,
          headers: {
            'Content-Type': 'application/json',
          },
          validateStatus: function (status) {
            return status >= 200 && status < 400 // default
          },
        }).then(function (response) {
          setLoading(false);
          dispatch({
            type: "SET_SITE",
            site: response?.data?.result.name + '-' + response?.data?.result.location,
          });
          window.location.reload();
        })
          .catch(function (error) {
          })
      }, 100);
    } else {
      setLoading(false);
    }
  }, [])

  if (loading) {
    return <span>Please Wait.Master Data Loading..</span>;
  }



  if (ready) {
    return (
      <Suspense fallback={<LayoutSplashScreen />}>
        <BrowserRouter basename={basename}>
          <I18nProvider>
            <LayoutProvider>
              <AuthInit>
                <Routes />
              </AuthInit>
            </LayoutProvider>
          </I18nProvider>
        </BrowserRouter>
      </Suspense>
    )
  } else {
    return <span>Loading...</span>;
  }
}

export { App }
