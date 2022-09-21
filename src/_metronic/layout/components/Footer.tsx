/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from 'react'
import { useLayout } from '../core'

const Footer: FC = () => {
  const { classes } = useLayout()
  return (
    <div className='footer py-4 d-flex flex-lg-column' id='kt_footer'>
      {/* begin::Container */}
      <div className='container' >
        <div
          className='d-flex flex-column flex-md-row align-items-center justify-content-between'
        >
          {/* begin::Copyright */}
          <div className='text-dark order-2 order-md-1'>
            <span className='text-muted fw-bold me-2'>{new Date().getFullYear()} &copy;</span>
            <a href='#' className='text-gray-800 text-hover-primary'>
              INSEE
            </a>
          </div>

          <div className='menu menu-gray-600 menu-hover-primary fw-bold order-1'>

          </div>
        </div>
      </div>
      {/* end::Container */}
    </div>
  )
}

export { Footer }
