import {FC} from 'react'
import {useLayout} from '../../_metronic/layout/core'
import {useTranslation} from 'react-i18next'
import {FormStatus} from '../helper/Common'
import {useDataLayerValue} from '../../DataLayer'

export function FooterSection(props) {
  const {classes} = useLayout()
  const {t, i18n, ready} = useTranslation()
  const [{site}, dispatch] = useDataLayerValue()

  return (
    <div>
      <div className='container'>
        <div className='row'>
          <div className='col-sm-3'>
            {props.backButtonStatus != FormStatus.NONE && !props.loading && (
              <button
                className='btn-insee-xl btn  btn-custom btn-secondary w-100'
                onClick={() => props.onStatusChange(props.backButtonStatus)}
              >
                <i class='fas fa-chevron-left fs-1x'></i> &nbsp;
                {props.backButtonText ? t(props.backButtonText) : t('COMMON.PREVIOUS')}
              </button>
            )}
          </div>
          <div className='col-sm-6'>
            {props.showText && (
              <div style={{textAlign: 'center', color: 'gray', paddingTop: '20px'}}>
                {props.showText}
              </div>
            )}
            {props.showReTakeExamButton && !props.loading && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  props.onStatusChange(FormStatus.QUESTION)
                }}
                className='btn-insee-xl btn  btn-custom btn-primary w-100'
              >
                {!props.retakeExamLoading && <label>{t('NOTIFICATION.RETAKE_EXAM')}</label>}
                {props.retakeExamLoading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    <span className='spinner-border spinner-border-lg align-middle ms-2'></span>
                  </span>
                )}
              </button>
            )}

            {props.showRePrintButton && !props.loading && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  props.onStatusChange(FormStatus.REPRINTING)
                }}
                className='btn-insee-xl btn  btn-custom btn-primary w-100'
              >
                {t('NOTIFICATION.REPRINT')}
              </button>
            )}

            {props.showCaptureImageButton && !props.loading && (
              <div>
                {props.image != '' ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      props.setImage('')
                    }}
                    className='btn-insee-xl btn  btn-custom btn-primary w-100'
                  >
                    {t('TAKEIMAGE.RETAKE_IMAGE')}
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      props.capture()
                    }}
                    className='btn-insee-xl btn  btn-custom btn-primary w-100'
                  >
                    {t('TAKEIMAGE.CAPTURE')}
                  </button>
                )}
              </div>
            )}
          </div>
          <div className='col-sm-3'>
            {props.nextButtonStatus != FormStatus.NONE && !props.retakeExamLoading && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  props.onStatusChange(props.nextButtonStatus)
                }}
                className='btn-insee-xl btn  btn-custom btn-danger w-100'
              >
                {!props.loading && (
                  <span className='indicator-label'>
                    {props.nextButtonText ? t(props.nextButtonText) : t('COMMON.NEXT')}
                    &nbsp; <i class='fas fa-chevron-right fs-1x'></i>
                  </span>
                )}
                {props.loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    <span className='spinner-border spinner-border-lg align-middle ms-2'></span>
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className='footer py-4 d-flex flex-lg-column' id='kt_footer'>
        {/* begin::Container */}
        <div className='container' style={{fontSize: '15px'}}>
          <div className='d-flex flex-column flex-md-row align-items-center justify-content-between'>
            {/* begin::Copyright */}
            <div className='text-dark order-2 order-md-1'>
              <span className='text-muted fw-bold me-2'>{new Date().getFullYear()} &copy;</span>
              <a href='#' className='text-gray-800 text-hover-primary'>
                Siam City Cement (Lanka) Limited / {site}
              </a>
            </div>

            <div className='menu menu-gray-600 menu-hover-primary  order-1'>
              Developed and Managed by Overleap (Pvt) Ltd
            </div>
          </div>
        </div>
      </div>
      {/* end::Container */}
    </div>
  )
}
///
/*
{props.nextButtonText !== '' ? (
    <div>{t('COMMON.NEXT')}</div>
  ) : (
    <div>{t('COMMON.NEXT')}</div>
  )}
  */
