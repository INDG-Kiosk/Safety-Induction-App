/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx'
import React from 'react'
import { Link } from 'react-router-dom'
import { KTSVG, toAbsoluteUrl } from '../../../helpers'
import { useLayout } from '../../core'
import { Header } from './Header'
import { DefaultTitle } from './page-title/DefaultTitle'
import { Topbar } from './Topbar'

export function HeaderWrapper() {
  const { config, classes, attributes } = useLayout()
  const { header, aside } = config

  return (
    <div className='header'>
      <div className={clsx(classes.headerContainer.join(' '), 'd-flex align-items-stretch justify-content-between')}>
        <div style={{ backgroundColor: "yellow", width: "100%" }} className='d-flex align-items-stretch justify-content-between flex-lg-grow-1'>
          <div className='col-lg-6 d-flex align-items-stretch my-5'>
            Back
          </div>
          <div className='col-lg-6 '>
            <div style={{ right: "0px", float: "right" }} className='d-flex align-items-stretch my-5'>
              <a>EXIT</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
