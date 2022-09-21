import React, {useState, useEffect} from 'react'
import {PageDataProvider} from '../../_metronic/layout/core'
import {Header} from '../../app/helper/header'
import {KTSVG, toAbsoluteUrl, WebAPIURL} from '../../_metronic/helpers'
import {FormStatus} from '../helper/Common'
import {FooterSection} from '../helper/footerSection'
import {Content} from '../../_metronic/layout/components/Content'
import CommonResources from '../helper/CommonResources'
import {setConstantValue} from 'typescript'
import {useTranslation} from 'react-i18next'
import axios from 'axios'

function Alert(props) {
  const {t, i18n, ready} = useTranslation()
  const [seconds, setSeconds] = useState(15)
  const [loading, setLoading] = useState(false)
  const [retakeExamLoading, setRetakeExamLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let interval = setInterval(() => {
      setSeconds((seconds) => seconds - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (seconds <= 0) {
    props.onStatusChange(FormStatus.WELCOME)
  }

  const onStatusChange = (func) => {
    /// implement the logic here
    console.log(func)
    switch (func) {
      default:
        props.onStatusChange(func)
        break
    }
  }

  return (
    <PageDataProvider>
      <Header
        onStatusChange={props.onStatusChange}
        backButtonStatus={props.backButtonStatus}
        isExitButtonActivate={props.isExitButtonActivate}
      />

      <Content>
        <div
          style={{marginTop: '10%'}}
          className='notice d-flex  rounded border-success border border-dashed mb-9 p-6'
        >
          <i className='fas fa-mark fs-4x '></i>
          <div className='d-flex flex-stack flex-grow-1' style={{marginLeft: '10px'}}>
            <div className='fw-bold'>
              <h1 className='fw-bolder fs-3x text-gray-700'>{t('ALERT.SESSION_EXPIRE')}</h1>
              <div className='fs-6 text-gray-600'>
                {t('ALERT.SESSION_EXPIRE_DETAIL')} {seconds}s
              </div>
            </div>
          </div>
        </div>
      </Content>
      <FooterSection
        onStatusChange={onStatusChange}
        backButtonStatus={props.backButtonStatus}
        nextButtonStatus={props.nextButtonStatus}
        nextButtonText={props.nextButtonText}
        backButtonText={props.backButtonText}
        showReTakeExamButton={props.showReTakeExamButton}
        loading={loading}
        retakeExamLoading={retakeExamLoading}
      />
    </PageDataProvider>
  )
}

export default Alert
