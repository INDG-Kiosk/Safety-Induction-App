/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx'
import {useLayout} from '../../_metronic/layout/core'
import {KTSVG, toAbsoluteUrl} from '../../_metronic/helpers'
import {FormStatus} from '../helper/Common'
import {useTranslation} from 'react-i18next'

export function Header(props) {
  const {t, i18n, ready} = useTranslation()
  const {config, classes, attributes} = useLayout()
  const {header, aside} = config

  return (
    <div className='header pb-1'>
      <div className='container'>
        <div className='row'>
          <div className='col-sm-10'>
            <img width='200px' src={toAbsoluteUrl('/media/insee.png')}></img>
          </div>
          <div className='col-sm-2'>
            {props.isExitButtonActivate && (
              <div
                onClick={() => props.onStatusChange(FormStatus.WELCOME)}
                className='btn-insee-xl btn  btn-custom w-100'
                style={{textAlign: 'right', paddingRight: '0px'}}
              >
                <i class='fas fa-times fs-3x'></i>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className='header'>
      <div className='container insee-center'>
        <div style={{width: '100%'}} className='d-flex align-items-stretch  flex-lg-grow-1'>
          <div className='col-sm-11 d-flex align-items-stretch my-5'>
            <img width='200px' src={toAbsoluteUrl('/img/insee.png')}></img>
            {/*} {props.backButtonStatus != FormStatus.NONE && (
              <a onClick={() => props.onStatusChange(props.backButtonStatus)}>
                <KTSVG
                  path='/media/icons/duotune/arrows/arr074.svg'
                  className='svg-icon-3x svg-icon-gray-600'
                />
                <span>{t('COMMON.BACK')}</span>
              </a>
           )} */}
          </div>
          <div className='col-sm-1'>
            <div style={{left: '0px', float: 'left'}} className='d-flex align-items-stretch my-5'>
              {props.isExitButtonActivate && (
                <a
                  onClick={() => props.onStatusChange(1)}
                  style={{
                    color: 'red',
                    textAlign: 'center',
                    // border: '1px solid red',
                    marginTop: '12px',
                  }}
                >
                  <i class='fas fa-times fs-3x'></i>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
{
  /*
  {props.isExitButtonActivate && (
                <a onClick={() => props.onStatusChange(1)} style={{color: 'red'}}>
                  <KTSVG
                    path='/media/icons/duotune/arrows/arr011.svg'
                    className='svg-icon-3x  svg-icon-gray'
                  />
                </a>
              )}
<div className='insee-Header' style={{paddingLeft: '0'}}>
      <div className='container'>
        <div className='fv-row'>
          <div className='row'>
            <div className='col-sm-6' style={{paddingLeft: '0'}}>
              <img width='200px' src={toAbsoluteUrl('/img/insee.png')}></img>
            </div>
            <div className='col-sm-6  '>
              <div
                style={{right: '0px', float: 'right'}}
                className='d-flex align-items-stretch my-5'
              >
                <a
                  onClick={() => props.onStatusChange(1)}
                  style={{color: 'red', marginRight: '20px'}}
                >
                  <KTSVG
                    path='/media/icons/duotune/arrows/arr011.svg'
                    className='svg-icon-3x  svg-icon-gray'
                  />
                </a>{' '}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> */
}
