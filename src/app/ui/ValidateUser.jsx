import React, {useState, useEffect, useRef} from 'react'
import {PageDataProvider} from '../../_metronic/layout/core'
import {Header} from '../../app/helper/header'
import {useTranslation} from 'react-i18next'
import {FormStatus} from '../helper/Common'
import {right} from '@popperjs/core'
import axios from 'axios'
import {FooterSection} from '../helper/footerSection'
import {Content} from '../../_metronic/layout/components/Content'
import {KTSVG, toAbsoluteUrl, WebAPIURL} from '../../_metronic/helpers'
import Alert from './Alert'
import {SESSIONTIMEOUT} from '../../app/ui/Common'

function isValidateNIC(val) {
  // Old NIC formats
  let regNIC = /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/
  if (regNIC.test(val)) {
    return true
  }

  // new NIC formats
  regNIC = /^([0-9]{12})$/
  if (regNIC.test(val)) {
    return true
  }

  return false
}

function ValidateUser(props) {
  const [timeout, setTimeout] = useState(SESSIONTIMEOUT)
  const {t, i18n, ready} = useTranslation()
  const [nic, setNIC] = useState(props.guest.nic)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let interval = setInterval(() => {
      setTimeout((timeout) => timeout - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const onStatusChange = (state) => {
    switch (state) {
      case props.currentStatus:
        return setTimeout(SESSIONTIMEOUT)
      case FormStatus.WELCOME:
        props.onStatusChange(FormStatus.WELCOME)
      default:
        let errorMessage = ''

        //skip multiple actions
        if (loading) return

        /// Vaidation
        if (!nic) {
          setMessage(t('VALIDATION.NIC_REQUIRED'))
          return
        }
        if (!isValidateNIC(nic)) {
          setMessage(t('VALIDATION.INVALID_NIC'))
          return
        }

        setMessage('')
        setLoading(true)

        setTimeout(() => {
          axios({
            method: 'get',
            url: process.env.REACT_APP_INSEE_KIOSK_BACKEND_API + '/api/guests/' + nic,
            data: {},
            headers: {
              'Content-Type': 'application/json',
            },
            validateStatus: function (status) {
              return status >= 200 && status < 400 // default
            },
          })
            .then(function (response) {
              setLoading(false)

              if (response?.data?.status === 'S') {
                props.guest.nic = nic
                props.guest.name = response?.data?.result.name
                props.guest.contractors = response?.data?.result.contractors
                props.guest.passValidDate = response?.data?.result.passValidDate

                switch (response?.data?.code) {
                  case 'TAKE_EXAM':
                    props.onStatusChangeWithValue(FormStatus.BASIC, props.guest)
                    break
                  case 'REPRINT':
                    props.onStatusChangeWithValue(FormStatus.REPRINT, props.guest)
                    break
                  case 'VALID':
                    props.onStatusChangeWithValue(FormStatus.VALID, props.guest)
                    break
                  default:
                    errorMessage = t('VALIDATION.API_SERVICE_DOWN')
                    break
                }
              } else {
                errorMessage = t('VALIDATION.API_SERVICE_DOWN')
              }
            })
            .catch(function (error) {
              if (error?.response?.data?.status === 'E') {
                errorMessage = error?.response?.data?.text
              } else {
                errorMessage = t('VALIDATION.API_SERVICE_DOWN')
              }

              setLoading(false)
              setMessage(errorMessage)
            })
        }, 1000)
        break
    }
  }

  if (timeout <= 0) {
    return (
      <Alert
        onStatusChange={onStatusChange}
        backButtonStatus={FormStatus.WELCOME}
        backButtonText={'COMMON.NO'}
        nextButtonStatus={props.currentStatus}
        nextButtonText={'COMMON.YES'}
        isExitButtonActivate={false}
        IsPass={false}
        showReTakeExamButton={false}
      />
    )
  }

  if (!ready) return <PageDataProvider></PageDataProvider>

  return (
    <PageDataProvider>
      <Header
        onStatusChange={props.onStatusChange}
        isExitButtonActivate={props.isExitButtonActivate}
      />
      <Content>
        <div className='fv-row'>
          <div className='row'>
            <div className='col-sm-12'>
              <h2 className='fw-bolder text-dark'>{t('VALIDATEUSER.ENTER_NIC')}</h2>
            </div>
            <div className='col-sm-12'>
              <input
                autoFocus
                className='form-control form-control-sm'
                type='text'
                value={nic}
                onChange={(e) => setNIC(e.target.value)}
              />
              <div style={{fontSize: '15px'}} className='text-danger text-sm mt-2'>
                {message}
              </div>
            </div>
          </div>
        </div>
      </Content>
      <FooterSection
        onStatusChange={onStatusChange}
        backButtonStatus={props.backButtonStatus}
        nextButtonStatus={props.nextButtonStatus}
        loading={loading}
      />
    </PageDataProvider>
  )
}

export default ValidateUser

/*
  if (!ready)
    return (
      <PageDataProvider>
        <Content>
          <div className='insee-lang-loading'>
            <span className='indicator-progress' style={{display: 'block'}}>
              Loading <span className='spinner-border spinner-border-lg align-middle ms-2'></span>
            </span>
          </div>
        </Content>
      </PageDataProvider>
    )
*/
