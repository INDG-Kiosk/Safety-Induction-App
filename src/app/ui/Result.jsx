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
//import {useReactToPrint} from 'react-to-print'
//import {saveAs} from 'file-saver'
import printJS from 'print-js'

function Result(props) {
  const {t, i18n, ready} = useTranslation()
  const [seconds, setSeconds] = useState(15)
  const [loading, setLoading] = useState(false)
  const [retakeExamLoading, setRetakeExamLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [document, setDocument] = useState()
  //var FileSaver = require('file-saver')

  useEffect(() => {
    if (props.IsPass) {
      setLoading(true)
      setTimeout(() => {
        axios({
          method: 'get',
          url:
            process.env.REACT_APP_INSEE_KIOSK_BACKEND_API + '/api/guests/print/' + props.guest.nic,
          data: {},
          headers: {
            'Content-Type': 'application/json',
          },
          responseType: 'blob',
          validateStatus: function (status) {
            return status >= 200 && status < 400 // default
          },
        })
          .then(function (response) {
            setLoading(false)

            const file = new Blob([response.data], {type: 'application/pdf'})
            printJS(URL.createObjectURL(file))

            // window.open(response.data, 'PRINT', 'height=400,width=600')
            //saveAs(file, name)
            // FileSaver.saveAs(new Blob([response.data]))
            // setDocument(response?.data)
            //handlePrint()
          })
          .catch(function (error) {
            //if (error?.response?.data?.status === 'E') {
            // //  errorMessage = error?.response?.data?.text
            // } else {
            //   errorMessage = t('VALIDATION.API_SERVICE_DOWN')
            // }
            setLoading(false)
            //setMessage(errorMessage)
          })
      }, 1000)
    }
  }, [])

  useEffect(() => {
    let interval = setInterval(() => {
      setSeconds((seconds) => seconds - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [document])

  if (seconds <= 0) {
    props.onStatusChange(FormStatus.WELCOME)
  }

  const onStatusChange = (func) => {
    /// implement the logic here

    switch (func) {
      case FormStatus.QUESTION:
        let errorMessage = ''

        //skip multiple actions
        if (retakeExamLoading) return
        setRetakeExamLoading(true)

        setTimeout(() => {
          //console.log(i18n.language.toLowerCase())
          var config = {
            method: 'get',
            url:
              process.env.REACT_APP_INSEE_KIOSK_BACKEND_API +
              '/api/sites/' +
              process.env.REACT_APP_INSEE_KIOSK_BACKEND_SITE_CODE +
              '/questions?lang=' +
              i18n.language.toLowerCase(),
            //data: i18n.language.toLowerCase(),
            headers: {
              'Content-Type': 'application/json',
            },
            validateStatus: function (status) {
              return status >= 200 && status < 400 // default
            },
          }
          axios(config)
            .then(function (response) {
              //console.log(JSON.stringify(response.data))
              setRetakeExamLoading(false)
              setMessage(errorMessage)
              if (response?.data?.status === 'S') {
                props.guest.questions = {
                  allQuestions: response?.data?.result,
                  answers: [],
                  current: 0,
                }
                props.onStatusChangeWithValue(FormStatus.QUESTION, props.guest)
              }
            })
            .catch(function (error) {
              if (error?.response?.data?.status === 'E') {
                errorMessage = error?.response?.data?.text
              } else {
                errorMessage = t('VALIDATION.API_SERVICE_DOWN')
              }

              setRetakeExamLoading(false)
              setMessage(errorMessage)
            })
        }, 1000)
        break
      default:
        props.onStatusChange(FormStatus.WELCOME)
        break
    }
  }

  if (!ready) return <PageDataProvider></PageDataProvider>

  if (
    props.state.appStatus === FormStatus.REPRINTING ||
    props.state.appStatus === FormStatus.PRINTING
  ) {
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
            className='notice d-flex bg-light-success rounded border-success border border-dashed mb-9 p-6'
          >
            <i className='fas fa-check fs-4x text-success'></i>
            <div className='d-flex flex-stack flex-grow-1' style={{marginLeft: '10px'}}>
              <div className='fw-bold'>
                <h1 className='fw-bolder fs-3x text-gray-700'>{t('NOTIFICATION.PRINTING')}</h1>
                <div className='fs-6 text-gray-600'>
                  {t('NOTIFICATION.PRINTING_NOTE')} {seconds}s
                </div>
              </div>
            </div>
          </div>
        </Content>
        <FooterSection
          onStatusChange={onStatusChange}
          backButtonStatus={props.backButtonStatus}
          nextButtonStatus={props.nextButtonStatus}
          nextButtonText={'COMMON.EXIT'}
          showReTakeExamButton={props.showReTakeExamButton}
          loading={loading}
          retakeExamLoading={retakeExamLoading}
        />
      </PageDataProvider>
    )
  }

  return (
    <PageDataProvider>
      <Header
        onStatusChange={props.onStatusChange}
        backButtonStatus={props.backButtonStatus}
        isExitButtonActivate={props.isExitButtonActivate}
      />

      <Content>
        {props.IsPass ? (
          <div
            style={{marginTop: '10%'}}
            className='notice d-flex bg-light-success rounded border-success border border-dashed mb-9 p-6'
          >
            <i className='fas fa-check fs-4x text-success'></i>
            <div className='d-flex flex-stack flex-grow-1' style={{marginLeft: '10px'}}>
              <div className='fw-bold'>
                <h1 className='fw-bolder fs-3x text-gray-700'>
                  {t('NOTIFICATION.CONGRATULATION')}
                </h1>
                <div className='fs-6 text-gray-600'>
                  {t('NOTIFICATION.CONGRATULATION_NOTE')} {seconds}s
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{marginTop: '10%'}}
            className='notice d-flex bg-light-danger rounded border-danger border border-dashed mb-9 p-6'
          >
            <i className='fas fa-times fs-4x text-danger'></i>
            <div className='d-flex flex-stack flex-grow-1' style={{marginLeft: '10px'}}>
              <div className='fw-bold'>
                <h1 className='fw-bolder fs-3x text-gray-700'>{t('NOTIFICATION.FAIL')}</h1>
                <div className='fs-6 text-gray-600'>
                  {t('NOTIFICATION.FAIL_NOTE')} {seconds}s
                </div>
              </div>
            </div>
          </div>
        )}

        {/*
         */}
      </Content>
      <FooterSection
        onStatusChange={onStatusChange}
        backButtonStatus={props.backButtonStatus}
        nextButtonStatus={props.nextButtonStatus}
        nextButtonText={'COMMON.EXIT'}
        showReTakeExamButton={props.showReTakeExamButton}
        loading={loading}
        retakeExamLoading={retakeExamLoading}
      />
    </PageDataProvider>
  )
}

export default Result
