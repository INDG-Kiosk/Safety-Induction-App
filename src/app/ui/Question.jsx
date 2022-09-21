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
import {SESSIONTIMEOUT} from '../../app/ui/Common'
import Alert from './Alert'

function Question(props) {
  const {t, i18n, ready} = useTranslation()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [timeout, setTimeout] = useState(SESSIONTIMEOUT)

  let ans = 0
  for (let index = 0; index < props.question.answers.length; index++) {
    const element = props.question.answers[index]
    if (element.question === props.question.allQuestions[props.question.current].code) {
      ans = element.answer
      break
    }
  }

  useEffect(() => {
    let interval = setInterval(() => {
      setTimeout((timeout) => timeout - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  let [state, setState] = useState({
    answer: ans,
    code: props.question.allQuestions[props.question.current].code,
  })

  if (state.code !== props.question.allQuestions[props.question.current].code) {
    setState({
      ...state,
      answer: ans,
      code: props.question.allQuestions[props.question.current].code,
    })
  }

  const onStatusChange = (func) => {
    switch (func) {
      case FormStatus.QUESTION:
        return setTimeout(SESSIONTIMEOUT)
      case FormStatus.RESULT:
        let errorMessage = ''

        if (state.answer <= 0) {
          setMessage(t('VALIDATION.SELECT_ANSWER'))
          return
        }

        //skip multiple actions
        if (loading) return

        setLoading(true)

        props.guest.questions.answers.push({
          question: props.question.allQuestions[props.question.current].code,
          answer: state.answer,
        })

        setTimeout(() => {
          var config = {
            method: 'post',
            url:
              process.env.REACT_APP_INSEE_KIOSK_BACKEND_API +
              '/api/sites/' +
              process.env.REACT_APP_INSEE_KIOSK_BACKEND_SITE_CODE +
              '/questions',
            data: {
              NIC: props.guest.nic,
              QuestionAnswers: props.guest.questions.answers,
            },
            headers: {
              'Content-Type': 'application/json',
            },
            validateStatus: function (status) {
              return status >= 200 && status < 400 // default
            },
          }
          axios(config)
            .then(function (response) {
              console.log(JSON.stringify(response.data))
              setLoading(false)
              setMessage(errorMessage)
              if (response?.data?.status === 'S') {
                props.guest.isPassed = response?.data?.result
                props.onStatusChangeWithValue(FormStatus.RESULT, props.guest)
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
      case FormStatus.NEXT_QUESTION:
        if (state.answer <= 0) {
          setMessage(t('VALIDATION.SELECT_ANSWER'))
          return
        }

        props.onNextQuestion(
          {
            question: props.question.allQuestions[props.question.current].code,
            answer: state.answer,
          },
          FormStatus.NEXT_QUESTION
        )
        setMessage('')
        console.log('NEXT')
        break
      case FormStatus.PRE_QUESTION:
        props.onPreQuestion()
        setMessage('')
        console.log('BK')
        break
      default:
        break
    }
    /// implement the logic here
    //props.onNextQuestion()
  }

  const onChangeValue = (event) => {
    console.log(event.target.value)
    setState({
      ...state,
      answer: event.target.value,
    })
  }

  if (timeout <= 0) {
    return (
      <Alert
        onStatusChange={onStatusChange}
        backButtonStatus={FormStatus.WELCOME}
        backButtonText={'COMMON.NO'}
        nextButtonStatus={FormStatus.QUESTION}
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
        <div className='pb-1 pb-lg-4'>
          <h3 className='fw-bolder text-dark'>
            {props.question.allQuestions[props.question.current].question}
          </h3>
        </div>
        <div className='pb-2 pb-lg-1 mb-10'>
          <h6 className='fw-bolder text-dark'>{t('QUESTION.SELECT_THE_ANSWER')}</h6>
          <div style={{fontSize: '15px'}} className='text-danger text-sm mt-2'>
            {message}
          </div>
        </div>
        <div className='fv-row '>
          <div className='row mb-2'>
            {props.question.allQuestions[props.question.current].answers.map((item, key) => (
              <div key={key} className='col-6 mb-10'>
                <label className='block'>
                  <input
                    onChange={(e) => onChangeValue(e)}
                    id={'rd_' + item.code}
                    type='radio'
                    name='radgroup'
                    value={item.code}
                    checked={item.code == state.answer ? true : false}
                  />
                  <span style={{marginLeft: '10px', fontSize: '1.35rem'}}>{item.answer}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </Content>
      <FooterSection
        onStatusChange={onStatusChange}
        backButtonStatus={props.backButtonStatus}
        nextButtonStatus={props.nextButtonStatus}
        showText={props.showText}
        nextButtonText={props.nextButtonText}
        loading={loading}
      />
    </PageDataProvider>
  )
}

export default Question
