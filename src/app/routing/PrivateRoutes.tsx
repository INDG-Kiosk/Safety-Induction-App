import React, { Suspense, lazy } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Welcome from '../ui/Welcome'
import ValidateUser from '../ui/ValidateUser'
import VisitDetail from '../ui/VisitDetail'
import TakeImage from '../ui/TakeImage'
import TakeVideo from '../ui/TakeVideo'
import Question from '../ui/Question'
import Result from '../ui/Result'
import RePrint from '../ui/RePrint'
import Home from '../ui/Home'
import TestWebCam from '../ui/TestWebCam'

export function PrivateRoutes() {

  return (

    <Switch>
      <Route path='/welcome' component={Welcome} />
      <Route path='/validate' component={ValidateUser} />
      <Route path='/visitdetail' component={VisitDetail} />
      <Route path='/takeimage' component={TakeImage} />
      <Route path='/takevideo' component={TakeVideo} />
      <Route path='/question' component={Question} />
      <Route path='/result' component={Result} />
      <Route path='/reprint' component={RePrint} />
      <Route path='/home' component={Home} />
      <Redirect to='error/404' />
    </Switch>

  )
}
