/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx'
import {useLayout} from '../../_metronic/layout/core'
import {KTSVG, toAbsoluteUrl} from '../../_metronic/helpers'

export function HeaderDefault() {
  const {config, classes, attributes} = useLayout()
  const {header, aside} = config

  return (
    <div className='header'>
      <div
        className={clsx(
          classes.headerContainer.join(' '),
          'd-flex align-items-stretch justify-content-between'
        )}
      >
        <div
          style={{width: '100%'}}
          className='d-flex align-items-stretch justify-content-between flex-lg-grow-1'
        >
          <div className='col-lg-4 d-flex align-items-stretch my-5'>
            <img width='200px' src={toAbsoluteUrl('/media/insee.png')}></img>
          </div>
        </div>
      </div>
    </div>
  )
}
