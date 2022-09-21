import React, {useState, useEffect, useRef} from 'react'
import {PageDataProvider} from '../../_metronic/layout/core'
import {Header} from '../../app/helper/header'
import {useTranslation} from 'react-i18next'
import {FormStatus} from '../helper/Common'
import {right} from '@popperjs/core'
import axios from 'axios'
import {FooterSection} from '../helper/footerSection'
import {Content} from '../../_metronic/layout/components/Content'
import {KTSVG, toAbsoluteUrl} from '../../_metronic/helpers'
import {setConstantValue} from 'typescript'
import Alert from './Alert'
import {SESSIONTIMEOUT} from '../../app/ui/Common'

function VisitDetail(props) {
  const [timeout, setTimeout] = useState(SESSIONTIMEOUT)
  const {t, i18n, ready} = useTranslation()
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  let options = []

  let [state, setState] = useState({
    visitorType: props.guest.visitorType,
    name: props.guest.name,
    nameText: '',
    contractorID: props.guest.contractorID ?? 0,
    contractorIDText: '',
  })

  for (let index = 0; index < props.guest.contractors.length; index++) {
    const element = props.guest.contractors[index]
    options.push({
      label:
        i18n.language === 'EN'
          ? element.nameEN
          : i18n.language === 'SI'
          ? element.nameSN
          : element.nameTA,
      value: element.code,
    })
  }

  useEffect(() => {
    let interval = setInterval(() => {
      setTimeout((timeout) => timeout - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const onStatusChange = (func) => {
    switch (func) {
      case props.currentStatus:
        return setTimeout(SESSIONTIMEOUT)
      case FormStatus.WELCOME:
        props.onStatusChange(FormStatus.WELCOME)
        break
      case FormStatus.VALIDATION:
        props.onStatusChange(func)
        break
      default:
        /// implement the logic here
        let errorMessage = ''

        //skip multiple actions

        /// Vaidation
        if (!state.name) {
          setState({
            ...state,
            nameText: t('VALIDATION.NAME_REQUIRED'),
          })
          return
        }

        // AC('sss')
        if (state.visitorType === 'WORKER' && state.contractorID <= 0) {
          setState({
            ...state,
            contractorIDText: t('VALIDATION.VISITOR_TYPE_REQUIRED'),
            nameText: '',
          })
          return
        }

        if (state.visitorType === 'WORKER' && state.contractorID === '') {
          setState({
            ...state,
            contractorIDText: t('VALIDATION.VISITOR_TYPE_REQUIRED'),
            nameText: '',
          })
          return
        }

        setState({
          ...state,
          contractorIDText: '',
          nameText: '',
        })

        props.guest.visitorType = state.visitorType
        props.guest.name = state.name
        props.guest.contractorID = state.contractorID
        props.onStatusChangeWithValue(FormStatus.IMAGE, props.guest)
        break
    }
  }

  const onWorkerTypeChnage = (event) => {
    setState({
      ...state,
      visitorType: event.target.value,
    })
  }

  const onContractorHandleChange = (event) => {
    setState({
      ...state,
      contractorID: event.target.value,
    })
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
        <div className='pb-5 pb-lg-1  mb-7'>
          <h2 className='fw-bolder text-dark'> {t('VISITDETAIL.ENTER_YOUR_NAME')}</h2>
          <input
            autofocus
            className='form-control form-control-lg'
            type='text'
            onChange={(e) => setState({...state, name: e.target.value})}
            value={state.name}
          />
          <div style={{fontSize: '15px'}} className='text-danger mt-2'>
            {state.nameText}
          </div>
        </div>
        <div className='mb-1 fv-row mb-7'>
          <div className='pb-5 pb-lg-1 '>
            <h2 className='fw-bolder text-dark'> {t('VISITDETAIL.CONTRACTOR.CONTRACTOR_TYPE')}</h2>
            {/*<div className='text-gray-400 fw-bold fs-6'>
            {t('VISITDETAIL.CONTRACTOR.CONTRACTOR_TYPE_NOTE')}
  </div> */}
          </div>
          <div className='row ' data-kt-buttons='true'>
            <div className='col'>
              <label>
                <input
                  onChange={onWorkerTypeChnage}
                  type='radio'
                  name='radgroup'
                  value='VISITOR'
                  checked={state.visitorType == 'VISITOR' ? true : false}
                />
                <span style={{marginLeft: '10px', fontSize: '1.5rem'}}>
                  {t('VISITDETAIL.CONTRACTOR.VISITOR')}
                </span>
              </label>
            </div>
            <div className='col'>
              <label>
                <input
                  onChange={onWorkerTypeChnage}
                  type='radio'
                  name='radgroup'
                  value='WORKER'
                  checked={state.visitorType == 'WORKER' ? true : false}
                />
                <span style={{marginLeft: '10px', fonytSize: '1.5rem'}}>
                  {t('VISITDETAIL.CONTRACTOR.WORKER')}
                </span>
              </label>
            </div>
          </div>
        </div>
        {state.visitorType === 'WORKER' && (
          <div>
            <div className='pb-5 pb-lg-1'>
              <h2 className='fw-bolder text-dark'>
                {t('VISITDETAIL.CONTRACTOR.CHOOSE_CONTRACTOR')}
              </h2>
              {/*<div className='text-gray-400 fw-bold fs-6'>
            {t('VISITDETAIL.CONTRACTOR.CHOOSE_CONTRACTOR_NOTE')}
          </div>*/}
            </div>
            <div className='mb-10 fv-row'>
              <select
                value={state.contractorID}
                className='form-select form-select-lg '
                onChange={onContractorHandleChange}
              >
                <option value='0'>---</option>
                {options.map((option) => (
                  <option value={option.value}>{option.label}</option>
                ))}
              </select>
              <div style={{fontSize: '15px'}} className='text-danger mt-2'>
                {state.contractorIDText}
              </div>
            </div>
          </div>
        )}
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

export default VisitDetail
