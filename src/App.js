import React from 'react'
import { Provider } from 'mobx-react'
import ErrorBoundary from 'react-error-boundary'

import ErrorScreen from './pages/ErrorScreen'
import Idle from './components/Idle'
import history from './services/history'
import * as stores from './stores'
import Routes from './Routes'
import './fontawesome'
import './App.scss'

export default class App extends React.Component {
  render() {
    return (
      <Provider history={history} {...stores}>
        <ErrorBoundary FallbackComponent={ErrorScreen}>
          <React.Fragment>
            <Idle />
            <div className="app-wrapper">
              <Routes />
            </div>
          </React.Fragment>
        </ErrorBoundary>
      </Provider>
    )
  }
}
