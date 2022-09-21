import React, {useState, useEffect, useRef} from 'react'
import {PageDataProvider} from '../../_metronic/layout/core'
import {Header} from '../helper/header'
import {KTSVG} from '../../_metronic/helpers'
import {HeaderDefault} from '../helper/HeaderDefault'
import {Content} from '../../_metronic/layout/components/Content'
import {FooterSection} from '../helper/footerSection'
import {FormStatus} from '../helper/Common'
import {useTranslation} from 'react-i18next'

function RePrint(props) {
  const {t, i18n, ready} = useTranslation()
  const [seconds, setSeconds] = useState(15)

  useEffect(() => {
    let interval = setInterval(() => {
      setSeconds((seconds) => seconds - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (seconds <= 0) {
    props.onStatusChange(FormStatus.WELCOME)
  }

  if (!ready) return <PageDataProvider></PageDataProvider>

  return (
    <PageDataProvider>
      <Header
        onStatusChange={props.onStatusChange}
        backButtonStatus={props.backButtonStatus}
        isExitButtonActivate={props.isExitButtonActivate}
      />

      <Content>
        {props.state.appStatus === FormStatus.REPRINT ? (
          <div
            style={{marginTop: '10%'}}
            className='notice d-flex bg-light-primary rounded border-primary border border-dashed mb-9 p-6'
          >
            <i className='fas fa-lightbulb fs-4x text-primary'></i>
            <div className='d-flex flex-stack flex-grow-1' style={{marginLeft: '10px'}}>
              <div className='fw-bold'>
                <h1 className='fw-bolder fs-3x text-gray-700'>{t('NOTIFICATION.THANK_YOU')}</h1>
                <div className='fs-6 text-gray-600'>
                  {t('NOTIFICATION.VALID')} {props.state.guest.passValidDate} {seconds}s
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{marginTop: '10%'}}
            className='notice d-flex bg-light-primary rounded border-primary border border-dashed mb-9 p-6'
          >
            <i className='fas fa-lightbulb fs-4x text-primary'></i>
            <div className='d-flex flex-stack flex-grow-1' style={{marginLeft: '10px'}}>
              <div className='fw-bold'>
                <h1 className='fw-bolder fs-3x text-gray-700'>{t('NOTIFICATION.THANK_YOU')}</h1>
                <div className='fs-6 text-gray-600'>
                  {t('NOTIFICATION.COLLECT')} {props.state.guest.passValidDate} {seconds}s
                </div>
              </div>
            </div>
            <img width='200' src='/media/card.png'></img>
          </div>
        )}
      </Content>
      <FooterSection
        onStatusChange={props.onStatusChange}
        backButtonStatus={props.backButtonStatus}
        nextButtonStatus={props.nextButtonStatus}
        nextButtonText={'COMMON.EXIT'}
        showRePrintButton={props.state.appStatus == FormStatus.REPRINT ? true : false}
      />
    </PageDataProvider>
  )
}

export default RePrint
