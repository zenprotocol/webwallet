// @flow

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Flexbox from 'flexbox-react'

import SecretPhraseStore from '../../stores/secretPhraseStore'
import NetworkStore from '../../stores/networkStore'
import Layout from '../../components/Layout'

import showSeed from './showSeedUtil'
import logout from './logoutUtil'
import './Settings.scss'

type Props = {
  secretPhraseStore: SecretPhraseStore,
  networkStore: NetworkStore
};

@inject('secretPhraseStore', 'networkStore')
@observer
class Settings extends Component<Props> {
  onAutoLogoutMinutesChanged = (evt) => {
    this.props.secretPhraseStore.setAutoLogoutMinutes(evt.target.value)
  }

  renderAutoLogout() {
    const { secretPhraseStore } = this.props
    return (
      <Flexbox className="row">
        <Flexbox flexDirection="column" className="description">
          <h2 className="description-title">Auto Logout</h2>
          <p>Configure auto logout after inactivity timeout</p>
        </Flexbox>
        <Flexbox flexDirection="column" className="actions">
          <div className="input-group">
            <input
              type="number"
              min="1"
              max="240"
              className="input-group-field"
              value={secretPhraseStore.autoLogoutMinutes}
              onChange={this.onAutoLogoutMinutesChanged}
            />
            <span className="input-group-label with-background">MIN</span>
          </div>
        </Flexbox>
      </Flexbox>
    )
  }

  renderShowSeed() {
    return (
      <Flexbox className="row">
        <Flexbox flexDirection="column" className="description">
          <h2 className="description-title">Show mnemonic</h2>
          <p>Display your mnemonic for account recovery</p>
        </Flexbox>
        <Flexbox flexDirection="column" className="actions">
          <button className="btn-block" onClick={() => showSeed()}>Show Mnemonic</button>
        </Flexbox>
      </Flexbox>
    )
  }

  renderLogout() {
    return (
      <Flexbox className="row">
        <Flexbox flexDirection="column" className="description">
          <h2 className="description-title">Logout</h2>
        </Flexbox>
        <Flexbox flexDirection="column" className="actions">
          <button className="secondary" onClick={logout}>Logout</button>
        </Flexbox>
      </Flexbox>
    )
  }
  render() {
    return (
      <Layout className="settings-page">
        <Flexbox className="page-title">
          <h1>General settings</h1>
        </Flexbox>
        {this.renderAutoLogout()}
        {this.renderShowSeed()}
        {this.renderLogout()}
      </Layout>
    )
  }
}

export default Settings
