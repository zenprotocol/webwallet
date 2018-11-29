// thoughts
// use amountInput and AutoSuggestAssets again?
// create transaction in this view, and not in a store
// what to do if funds are insfufficient or user doens't have asset? should we communicate to the dapp?
// what to do if user isn't opted in to wallet? I think we should communicate to dapp?

// @flow

import React, { Component } from 'react'
import Flexbox from 'flexbox-react'
import { inject, observer } from 'mobx-react'
import cx from 'classnames'

import confirmPasswordModal from '../../services/confirmPasswordModal'
import SecretPhraseStore from '../../stores/secretPhraseStore'
import PortfolioStore from '../../stores/portfolioStore'
import { isValidAddress, numberWithCommas } from '../../utils/helpers'
import IsValidIcon from '../../components/IsValidIcon'
import ProtectedButton from '../../components/ProtectedButton'

type Props = {
  secretPhraseStore: SecretPhraseStore,
  portfolioStore: PortfolioStore
};

@inject('portfolioStore', 'secretPhraseStore')
@observer
class SendTx extends Component<Props> {
  state = {
    inProgress: false
  }
  async componentDidMount() {
    const confirmedPassword = await this.authPassword()
    this.props.secertPhraseStore.unlockWalletInIframe(confirmedPassword)
    this.props.portfolioStore.fetch()
  }
  
  async authPassword() {
    const confirmedPassword = await confirmPasswordModal()
    if (!confirmedPassword) {
      return this.authPassword()
    }
    return confirmedPassword
  }

  get chain() { // from iframe
    return 'testnet'
  }

  get to() { // from iframe
    return 'tzn1qzh59xyvq8qj7p76gdq85vauk407xfu0d9nxnqe50gqdvq9x4zjgs9d49t0'
  }

  get asset() { // from iframe
    return '00'
  }

  get amountDisplay() { // from iframe
    return '1'
  }

  get amount() {
    return Number(this.amountDisplay)
  }

  get isToInvalid() {
    return this.to.length && !isValidAddress(this.to)
  }

  onSubmitButtonClicked = async () => {
    console.log('send transaction!')
  }

  get isAmountValid() {
    console.log('isAmountValid', this.props.portfolioStore.getBalanceFor(this.asset))
    return this.amount && (this.amount <= this.props.portfolioStore.getBalanceFor(this.asset))
  }

  get isToValid() {
    const { to } = this.props.sendTxStore
    return (to.length > 0) && isValidAddress(to)
  }

  get areAllFieldsValid() {
    return !!(this.asset && this.to && this.isAmountValid && this.isToValid)
  }

  get isSubmitButtonDisabled() {
    return this.state.inProgress || !this.areAllFieldsValid
  }

  get renderAsset() {
    return (
      <Flexbox flexGrow={1} flexDirection="column" className="select-asset">
        <label htmlFor="asset">Asset</label>
        <input id="asset" value={this.asset} readOnly type="text" />
        {/* {this.renderChosenAssetName()} */}
      </Flexbox>

    )
  }
  get renderAmount() {
    return (
      <Flexbox flexGrow={0} flexDirection="column" className="amount">
      <label htmlFor="amount">Amount</label>
      <Flexbox
        flexDirection="row"
        className='amountInputContainer'
      >
        <input
          id="amount"
          type="text"
          readOnly
          value={numberWithCommas(this.amountDisplay)}
        />
      </Flexbox>
    </Flexbox>
    )
  }
  render() {
    return (
      <div className="send-tx">
        <Flexbox flexDirection="column" className="send-tx-container">

          <Flexbox className="page-title">
            <h1>Send</h1>
          </Flexbox>

          <Flexbox flexDirection="column" className="form-container">

            <Flexbox flexDirection="column" className="destination-address-input form-row">
              <label htmlFor="to">Destination Address</label>
              <Flexbox flexDirection="row" className="destination-address-input">

                <Flexbox flexDirection="column" className="full-width relative">
                  <input
                    id="to"
                    name="to"
                    type="text"
                    readOnly
                    placeholder="Destination address"
                    className={cx({ 'is-valid': this.isToValid, error: this.isToInvalid })}
                    value={this.to}
                  />
                  <IsValidIcon
                    isValid={isValidAddress(this.to)}
                    className="input-icon"
                    hasColors
                  />
                </Flexbox>
              </Flexbox>
            </Flexbox>
            <Flexbox flexDirection="row">
              {/* $FlowIssue */}
              {this.renderAsset}
              {this.renderAmount}
            </Flexbox>
          </Flexbox>
          <Flexbox flexDirection="row">
            <Flexbox flexGrow={2} />
            <Flexbox flexGrow={1} justifyContent="flex-end" flexDirection="row">
              <ProtectedButton
                className={cx('button-on-right', { loading: this.state.inProgress })}
                disabled={this.isSubmitButtonDisabled}
                onClick={this.onSubmitButtonClicked}
              >
                {this.state.inProgress ? 'Signing Transcation' : 'Sign Transcation'}
              </ProtectedButton>
            </Flexbox>
          </Flexbox>
        </Flexbox>
      </div>
    )
  }
}

export default SendTx
