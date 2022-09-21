import React, {useState, useEffect} from 'react'
import {PageDataProvider} from '../../_metronic/layout/core'
import {Header} from '../helper/header'
import {KTSVG} from '../../_metronic/helpers'
import Welcome from './Welcome'
import ValidateUser from './ValidateUser'
import VisitDetail from './VisitDetail'
import TakeImage from './TakeImage'
import TakeVideo from './TakeVideo'
import Question from './Question'
import Result from './Result'
import RePrint from './RePrint'
import {useTranslation} from 'react-i18next'
import {FormStatus} from '../helper/Common'
import {fail} from 'assert'
import {stat} from 'fs'

function Home() {
  const TIMEOUT_TIME = 5
  const initGuest = {
    nic: '',
    name: '',
    visitorType: 'VISITOR',
    questions: {
      allQuestions: [],
      answers: [],
      current: 0,
    },
    isPassed: '',
    passValidDate: '',
    video: '',
  }
  const {t, i18n, ready} = useTranslation()
  const [state, setState] = useState({
    lang: '',
    appStatus: FormStatus.WELCOME,
    guest: initGuest,
  })

  const onStatusChange = (status) => {
    setTimeout(TIMEOUT_TIME)
    if (FormStatus.QUESTION == status || FormStatus.WELCOME == status) {
      setState({
        ...state,
        appStatus: status,
        guest: initGuest,
      })
    } else {
      setState({
        ...state,
        appStatus: status,
      })
    }
  }

  const onStatusChangeWithValue = (status, guest) => {
    setTimeout(TIMEOUT_TIME)
    console.log(status)
    if (FormStatus.QUESTION == status || FormStatus.WELCOME == status) {
      setState({
        ...state,
        appStatus: status,
        guest: guest,
      })
    } else {
      setState({
        ...state,
        appStatus: status,
        guest: guest,
      })
    }
  }

  const onSetLanguage = (lan) => {
    i18n.init({
      lng: lan,
      fallbackLng: false,
    })
    // console.log('SET ANS ' + lan)
    /*
    setQuestions(questions_en)
    if (lan === 'SI') {
      setQuestions(questions_sn)
    }
*/
    i18n.changeLanguage(lan)

    setState({
      ...state,
      appStatus: FormStatus.VALIDATION,
      lang: lan,
      questions: {
        allQuestions: [],
        answers: [],
        current: 0,
      },
    })
  }

  const onNextQuestion = (answer, status) => {
    const newAnsewers = []
    for (let index = 0; index < state.guest.questions.answers.length; index++) {
      const element = state.guest.questions.answers[index]
      if (element.question !== answer.question) {
        newAnsewers.push(element)
      }
    }
    newAnsewers.push(answer)

    setState({
      ...state,
      appStatus: status,
      guest: {
        ...state.guest,
        questions: {
          ...state.guest.questions,
          answers: newAnsewers,
          current: state.guest.questions.current + 1,
        },
      },
    })
  }

  const onPreQuestion = () => {
    setState({
      ...state,
      guest: {
        ...state.guest,
        questions: {
          ...state.guest.questions,
          current: state.guest.questions.current - 1,
        },
      },
    })
  }

  switch (state.appStatus) {
    case FormStatus.WELCOME:
      return (
        <Welcome
          onSetLanguage={onSetLanguage}
          backButtonStatus={FormStatus.NONE}
          nextButtonStatus={FormStatus.NONE}
          isExitButtonActivate={false}
        />
      )
    case FormStatus.VALIDATION:
      return (
        <ValidateUser
          onStatusChange={onStatusChange}
          backButtonStatus={FormStatus.NONE}
          nextButtonStatus={FormStatus.BASIC}
          isExitButtonActivate={true}
          onStatusChangeWithValue={onStatusChangeWithValue}
          guest={state.guest}
          currentStatus={state.appStatus}
        />
      )
    case FormStatus.BASIC:
      return (
        <VisitDetail
          onStatusChange={onStatusChange}
          onStatusChangeWithValue={onStatusChangeWithValue}
          backButtonStatus={FormStatus.VALIDATION}
          nextButtonStatus={FormStatus.IMAGE}
          isExitButtonActivate={true}
          guest={state.guest}
          currentStatus={state.appStatus}
        />
      )
    case FormStatus.IMAGE:
      console.log('this calling')
      return (
        <TakeImage
          onStatusChange={onStatusChange}
          onStatusChangeWithValue={onStatusChangeWithValue}
          backButtonStatus={FormStatus.BASIC}
          nextButtonStatus={FormStatus.VIDEO}
          isExitButtonActivate={true}
          guest={state.guest}
          currentStatus={state.appStatus}
        />
      )
    case FormStatus.VIDEO:
      if (state.guest.visitorType === 'VISITOR') {
        return (
          <TakeVideo
            onStatusChange={onStatusChange}
            onStatusChangeWithValue={onStatusChangeWithValue}
            backButtonStatus={FormStatus.NONE}
            nextButtonStatus={FormStatus.PRINTING}
            isExitButtonActivate={true}
            nextButtonText={'COMMON.PRINT'}
            guest={state.guest}
            currentStatus={state.appStatus}
          />
        )
      }

      return (
        <TakeVideo
          onStatusChange={onStatusChange}
          onStatusChangeWithValue={onStatusChangeWithValue}
          backButtonStatus={FormStatus.NONE}
          nextButtonStatus={FormStatus.QUESTION}
          isExitButtonActivate={true}
          nextButtonText={'WATCHVIDEO.TAKE_EXAM'}
          guest={state.guest}
          currentStatus={state.appStatus}
        />
      )
    case FormStatus.QUESTION:
    case FormStatus.NEXT_QUESTION:
    case FormStatus.PRE_QUESTION:
      var previousState = FormStatus.PRE_QUESTION
      var nextState = FormStatus.NEXT_QUESTION
      var nextbuttontext = ''
      if (state.guest.questions.current === 0) previousState = FormStatus.NONE

      if (state.guest.questions.current === state.guest.questions.allQuestions.length - 1) {
        nextState = FormStatus.RESULT
        nextbuttontext = 'COMMON.COMPLETED'
      }

      return (
        <Question
          question={state.guest.questions}
          onStatusChange={onStatusChange}
          backButtonStatus={previousState}
          nextButtonStatus={nextState}
          isExitButtonActivate={true}
          showText={
            state.guest.questions.current + 1 + '/' + state.guest.questions.allQuestions.length
          }
          onNextQuestion={onNextQuestion}
          onPreQuestion={onPreQuestion}
          nextButtonText={nextbuttontext}
          onStatusChangeWithValue={onStatusChangeWithValue}
          guest={state.guest}
          currentStatus={state.appStatus}
        />
      )

    case FormStatus.RESULT:
      if (state.guest.isPassed !== 'FAILED') {
        return (
          <Result
            onStatusChange={onStatusChange}
            backButtonStatus={FormStatus.NONE}
            nextButtonStatus={FormStatus.NONE}
            isExitButtonActivate={false}
            IsPass={true}
            showReTakeExamButton={false}
            guest={state.guest}
            onStatusChangeWithValue={onStatusChangeWithValue}
            state={state}
          />
        )
      }

      return (
        <Result
          onStatusChange={onStatusChange}
          backButtonStatus={FormStatus.NONE}
          nextButtonStatus={FormStatus.WELCOME}
          isExitButtonActivate={false}
          IsPass={false}
          showReTakeExamButton={true}
          guest={state.guest}
          onStatusChangeWithValue={onStatusChangeWithValue}
          state={state}
        />
      )
    case FormStatus.REPRINTING:
    case FormStatus.PRINTING:
      return (
        <Result
          onStatusChange={onStatusChange}
          backButtonStatus={FormStatus.NONE}
          nextButtonStatus={FormStatus.NONE}
          isExitButtonActivate={false}
          IsPass={true}
          showReTakeExamButton={false}
          guest={state.guest}
          onStatusChangeWithValue={onStatusChangeWithValue}
          state={state}
        />
      )
    case FormStatus.REPRINT:
    case FormStatus.VALID:
      /* return (
        <Result
          onStatusChange={onStatusChange}
          backButtonStatus={FormStatus.NONE}
          nextButtonStatus={FormStatus.NONE}
          isExitButtonActivate={false}
          IsPass={true}
          showReTakeExamButton={false}
          guest={state.guest}
          onStatusChangeWithValue={onStatusChangeWithValue}
        />
      )
      */

      return (
        <RePrint
          onStatusChange={onStatusChange}
          backButtonStatus={FormStatus.NONE}
          nextButtonStatus={FormStatus.NONE}
          isExitButtonActivate={false}
          state={state}
        />
      )
    default:
      return <div>FORM NOT DEFINE</div>
  }
  return <div>Home</div>
}
export default Home
