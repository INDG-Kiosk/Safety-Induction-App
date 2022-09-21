import React, {Component, useState, useEffect} from 'react'
import {PageDataProvider} from '../../_metronic/layout/core'
import {Header} from '../helper/header'
import {FormStatus} from '../helper/Common'
import Webcam from 'react-webcam'
import {useTranslation} from 'react-i18next'
import axios from 'axios'
import {FooterSection} from '../helper/footerSection'
import {Content} from '../../_metronic/layout/components/Content'
import {KTSVG, toAbsoluteUrl, WebAPIURL} from '../../_metronic/helpers'
import {SESSIONTIMEOUT} from '../../app/ui/Common'
import Alert from './Alert'

const WebcamComponent = () => <Webcam />

const videoConstraints = {
  width: 220,
  height: 200,
  facingMode: 'user',
}

function TakeImage(props) {
  const [timeout, setTimeout] = useState(SESSIONTIMEOUT)
  const {t, i18n, ready} = useTranslation()
  const webcamRef = React.useRef(null)
  const [image, setImage] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    setImage(imageSrc)
  }, [webcamRef])

  useEffect(() => {
    let interval = setInterval(() => {
      setTimeout((timeout) => timeout - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const onStatusChange = (func) => {
    switch (func) {
      case FormStatus.BASIC:
        props.onStatusChange(func)
        break
      case props.currentStatus:
        return setTimeout(SESSIONTIMEOUT)
      default:
        /// implement the logic here
        let errorMessage = ''

        //skip multiple actions
        if (loading) return

        /// Vaidation
        // if (!image) {
        // setMessage(t('VALIDATION.IMG_REQUIRED'))
        // return
        //}
        setMessage('')
        setLoading(true)
        // console.log('xxxxxxxxxxx')
        setTimeout(() => {
          axios({
            method: 'post',
            url: process.env.REACT_APP_INSEE_KIOSK_BACKEND_API + '/api/guests',
            data: {
              Name: props.guest.name,
              NIC: props.guest.nic,
              Type: props.guest.visitorType,
              SiteCode: process.env.REACT_APP_INSEE_KIOSK_BACKEND_SITE_CODE,
              ProfileImage: image,
              ContractorCode: props.guest.contractorID,
              Lang: i18n.language.toLowerCase(),
            },
            headers: {
              //'Content-Type': 'multipart/form-data',
              'Content-Type': 'application/json',
            },
            validateStatus: function (status) {
              return status >= 200 && status < 400 // default
            },
          })
            .then(function (response) {
              //console.log(JSON.stringify(response.data))
              setLoading(false)
              setMessage(errorMessage)
              if (response?.data?.status === 'S') {
                props.guest.video = response.data.result
                props.onStatusChangeWithValue(FormStatus.VIDEO, props.guest)
                //props.onStatusChange(FormStatus.VIDEO)
              }
            })
            .catch(function (error) {
              //console.log(error?.response?.data?.status)
              //console.log(error?.response?.data?.text)
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
        backButtonStatus={props.backButtonStatus}
        isExitButtonActivate={props.isExitButtonActivate}
      />
      <Content>
        <div style={{marginTop: '-40px'}} className='pb-5 pb-lg-1'>
          <h2 className='fw-bolder text-dark'>{t('TAKEIMAGE.TITLE')}</h2>
          <div style={{fontSize: '15px'}} className='text-danger text-sm mt-2'>
            {message}
          </div>
        </div>
        <div className='mb-1 fv-row'>
          <div className='row' style={{backgroundColor: 'black'}}>
            <div className='col-sm-4 pb-2 pb-lg-2'></div>
            <div className='col-sm-4 pb-2 pb-lg-8'>
              {image == '' ? (
                <Webcam
                  audio={false}
                  height='400px'
                  ref={webcamRef}
                  screenshotFormat='image/jpeg'
                  width='100%'
                  videoConstraints={videoConstraints}
                />
              ) : (
                <div>
                  <br />
                  <img className='img-insee-x1' src={image} />
                </div>
              )}
            </div>
            <div className='col-sm-4 pb-2 pb-lg-2'></div>
          </div>
        </div>
      </Content>
      <FooterSection
        onStatusChange={onStatusChange}
        backButtonStatus={props.backButtonStatus}
        nextButtonStatus={props.nextButtonStatus}
        showCaptureImageButton={true}
        capture={capture}
        setImage={setImage}
        image={image}
        loading={loading}
      />
    </PageDataProvider>
  )
}

export default TakeImage
