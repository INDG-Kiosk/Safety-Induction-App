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

function Welcome(props) {
  return (
    <PageDataProvider>
      <Header
        onStatusChange={props.onStatusChange}
        isExitButtonActivate={props.isExitButtonActivate}
      />
      <Content>
        <div className='container insee-center'>
          <div className='pb-5 pb-lg-5'>
            <h2 className='fw-bolder text-dark'>
              Select Preferred Language/ භාෂාව තෝරන්න/ மொழி தேர்வு
            </h2>
            <div className='text-gray-400 fw-bold fs-6'></div>
          </div>
          <div className='fv-row'>
            <div className='row'>
              <div className='col-sm-4 pb-2 pb-lg-4'>
                <button
                  onClick={() => props.onSetLanguage('SI')}
                  className='btn-insee-xxl btn  btn-custom btn-danger w-100'
                >
                  සිංහල
                </button>
              </div>
              <div className='col-sm-4 pb-2  pb-lg-4'>
                <button
                  onClick={() => props.onSetLanguage('EN')}
                  className='btn-insee-xxl btn  btn-custom btn-danger w-100'
                >
                  English
                </button>
              </div>
              <div className='col-sm-4'>
                <button
                  onClick={() => props.onSetLanguage('TA')}
                  className='btn-insee-xxl btn  btn-custom btn-danger w-100'
                >
                  தமிழ்
                </button>
              </div>
            </div>
          </div>
        </div>
      </Content>
      <FooterSection
        onStatusChange={props.onStatusChange}
        backButtonStatus={props.backButtonStatus}
        nextButtonStatus={props.nextButtonStatus}
      />
    </PageDataProvider>
  )
}

export default Welcome
