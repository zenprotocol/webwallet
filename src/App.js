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
import Header from "./components/Header"
import Updater from "./components/Updater/Updater"

export default class App extends React.Component {
  render() {
    return (
        <React.Fragment>
          <Provider history={history} {...stores}>
            <ErrorBoundary FallbackComponent={ErrorScreen}>
              <React.Fragment>
                <Updater />
                <div className="app-wrapper">
                  <Header/>
                  <Routes />
                </div>
              </React.Fragment>
            </ErrorBoundary>
          </Provider>
        </React.Fragment>
    )
  }
}
