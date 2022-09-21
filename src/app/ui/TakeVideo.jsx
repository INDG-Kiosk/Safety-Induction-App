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
import {SESSIONTIMEOUT} from '../../app/ui/Common'
import Alert from './Alert'

function TakeVideo(props) {
  const [timeout, setTimeout] = useState(SESSIONTIMEOUT)
  const {t, i18n, ready} = useTranslation()
  const [loading, setLoading] = useState(false)
  const [videoPlayFinished, setvideoPlayFinished] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (videoPlayFinished) {
      let interval = setInterval(() => {
        setTimeout((timeout) => timeout - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [videoPlayFinished])

  const onStatusChange = (func) => {
    switch (func) {
      case props.currentStatus:
        setvideoPlayFinished(false)
        return setTimeout(SESSIONTIMEOUT)
      case FormStatus.PRINTING:
        props.onStatusChange(func)
        break
      case FormStatus.QUESTION:
        /// implement the logic here

        let errorMessage = ''

        //skip multiple actions
        if (loading) return
        setLoading(true)

        setTimeout(() => {
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
              // console.log(JSON.stringify(response.data))
              setLoading(false)
              setMessage(errorMessage)
              if (response?.data?.status === 'S') {
                if (props.guest.visitorType === '') {
                }

                props.guest.questions = {
                  allQuestions: response?.data?.result,
                  answers: [],
                  current: 0,
                }
                props.onStatusChangeWithValue(FormStatus.QUESTION, props.guest)
                /* props.guest.nic = nic
         props.guest.name = response?.data?.result.name
         props.guest.contractors = response?.data?.result.contractors
         props.guest.passValidDate = response?.data?.result.passValidDate

         switch (response?.data?.code) {
           case 'TAKE_EXAM':
             props.onStatusChangeWithValue(FormStatus.BASIC, props.guest)
             break
           case 'REPRINT':
             props.onStatusChangeWithValue(FormStatus.NOTIFICATION, props.guest)
             break
           case 'VALID':
             props.onStatusChangeWithValue(FormStatus.NOTIFICATION2, props.guest)
             break
           default:
             errorMessage = t('VALIDATION.API_SERVICE_DOWN')
             break
         }*/
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
      default:
        props.onStatusChange(FormStatus.WELCOME)
        break
    }
  }

  const onVideoPlayEnd = () => {
    console.log('Video has ended')
    setvideoPlayFinished(true)
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

  const tryRequire = (path) => {
    try {
      return require(`${path}`)
    } catch (err) {
      return null
    }
  }

  if (!ready) return <PageDataProvider></PageDataProvider>

  return (
    <PageDataProvider>
      <Header
        onStatusChange={props.onStatusChange}
        isExitButtonActivate={props.isExitButtonActivate}
      />
      <Content>
        <div style={{marginTop: '-40px'}} className='pb-5 pb-lg-1'>
          <h2 className='fw-bolder text-dark'> {t('WATCHVIDEO.TITLE')}</h2>
          {props.guest.visitorType !== 'V' && (
            <div className='text-gray-400 fw-bold fs-6'>{t('WATCHVIDEO.NOTE')}</div>
          )}
          <div style={{fontSize: '15px'}} className='text-danger text-sm mt-2'>
            {message}
          </div>
        </div>
        <div className='mb-1 fv-row'>
          <div className='row mb-2' data-kt-buttons='true'>
            <div className='col'>
              <video width='100%' height='400' autoPlay onEnded={() => onVideoPlayEnd()}>
                <source
                  src={
                    tryRequire(toAbsoluteUrl('/media/video/' + props.guest.video))
                      ? toAbsoluteUrl('/media/video/' + props.guest.video)
                      : process.env.REACT_APP_INSEE_KIOSK_BACKEND_API +
                        '/Uploads/' +
                        props.guest.video
                  }
                  type='video/mp4'
                />
              </video>
            </div>
          </div>
        </div>
      </Content>
      <FooterSection
        onStatusChange={onStatusChange}
        backButtonStatus={props.backButtonStatus}
        nextButtonStatus={props.nextButtonStatus}
        nextButtonText={props.nextButtonText}
        loading={loading}
      />
    </PageDataProvider>
  )
}

export default TakeVideo
