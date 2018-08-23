import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'

import routes from './constants/routes'
import history from './services/history'
import Portfolio from './pages/Portfolio/Portfolio'
import SendTx from './pages/SendTx/SendTx'
import TxHistory from './pages/TxHistory/TxHistory'
import Receive from './pages/Receive/Receive'
import ActiveContracts from './pages/ActiveContracts/ActiveContracts'
import Faucet from './pages/Faucet/Faucet'
import Loading from './pages/Loading/Loading'
import UnlockWallet from './pages/UnlockWallet/UnlockWallet'
import Settings from './pages/Settings'
// Onboarding routes
import WelcomeMessages from './onBoardingPages/WelcomeMessages/WelcomeMessages'
import ImportOrCreateWallet from './onBoardingPages/ImportOrCreateWallet/ImportOrCreateWallet'
import ImportWallet from './onBoardingPages/ImportWallet/ImportWallet'
import SecretPhrase from './onBoardingPages/SecretPhrase/SecretPhrase'
import SecretPhraseQuiz from './onBoardingPages/SecretPhraseQuiz/SecretPhraseQuiz'
import SetPassword from './onBoardingPages/SetPassword/SetPassword'
import TermsOfService from './onBoardingPages/TermsOfService/TermsOfService'

const Routes = () => (
  <Router history={history}>
    <Switch>
      <Route exact path={routes.HOME} component={Loading} />
      <Route exact path={routes.PORTFOLIO} component={Portfolio} />
      <Route exact path={routes.RECEIVE} component={Receive} />
      <Route exact path={routes.SEND_TX} component={SendTx} />
      <Route exact path={routes.TX_HISTORY} component={TxHistory} />
      <Route exact path={routes.ACTIVE_CONTRACTS} component={ActiveContracts} />
      <Route exact path={routes.FAUCET} component={Faucet} />
      <Route exact path={routes.LOADING} component={Loading} />
      <Route exact path={routes.UNLOCK_WALLET} component={UnlockWallet} />
      <Route exact path={routes.SETTINGS} component={Settings} />
      { /* Onboarding Routes */ }
      <Route exact path={routes.WELCOME_MESSAGES} component={WelcomeMessages} />
      <Route exact path={routes.IMPORT_OR_CREATE_WALLET} component={ImportOrCreateWallet} />
      <Route exact path={routes.IMPORT_WALLET} component={ImportWallet} />
      <Route exact path={routes.SECRET_PHRASE} component={SecretPhrase} />
      <Route exact path={routes.SECRET_PHRASE_QUIZ} component={SecretPhraseQuiz} />
      <Route exact path={routes.SET_PASSWORD} component={SetPassword} />
      <Route exact path={routes.TERMS_OF_SERVICE} component={TermsOfService} />
    </Switch>
  </Router>
)

export default Routes
