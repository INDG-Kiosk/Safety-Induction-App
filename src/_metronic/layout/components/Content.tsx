import React, { useEffect } from 'react'
import { useLocation } from 'react-router'
import clsx from 'clsx'
import { useLayout } from '../core'
import { DrawerComponent } from '../../assets/ts/components'

const Content: React.FC = ({ children }) => {
  const { classes } = useLayout()
  const location = useLocation()
  useEffect(() => {
    DrawerComponent.hideAll()
  }, [location])

  return (
    <div className='page d-flex flex-row flex-column-fluid'>
      <div className='wrapper d-flex flex-column flex-row-fluid ' id='kt_wrapper'>
        <div id='kt_content' className='content d-flex flex-column flex-column-fluid'>
          <div className='post d-flex flex-column-fluid ' id='kt_post'>
            <div id='kt_content_container' className={clsx(classes.contentContainer.join(' '))}>
              <br />
              {children}
            </div>     </div>
        </div>
      </div>
    </div>
  )
}

export { Content }
