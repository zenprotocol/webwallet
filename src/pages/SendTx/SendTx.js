// @flow

import React, { Component } from 'react'
import Flexbox from 'flexbox-react'
import { inject, observer } from 'mobx-react'
import cx from 'classnames'

import FontAwesomeIcon from '../../vendor/@fortawesome/react-fontawesome'
import SendTxStore from '../../stores/sendTxStore'
import PortfolioStore from '../../stores/portfolioStore'
import { isValidAddress } from '../../utils/helpers'
import { ref } from '../../utils/domUtils'
import { isZenAsset } from '../../utils/zenUtils'
import { ZENP_MAX_DECIMALS, ZENP_MIN_DECIMALS } from '../../constants/constants'
import Layout from '../../components/Layout'
import IsValidIcon from '../../components/IsValidIcon'
import ProtectedButton from '../../components/ProtectedButton'
import AutoSuggestAssets from '../../components/AutoSuggestAssets'
import FormResponseMessage from '../../components/FormResponseMessage'
import AmountInput from '../../components/AmountInput'
// import PasteButton from '../../components/PasteButton'

type Props = {
  sendTxStore: SendTxStore,
  portfolioStore: PortfolioStore
};

@inject('portfolioStore', 'sendTxStore')
@observer
class SendTx extends Component<Props> {
  componentDidMount() {
    this.props.portfolioStore.fetch()
  }

  onToChanged = (evt: SyntheticEvent<HTMLInputElement>) => {
    this.props.sendTxStore.to = evt.currentTarget.value.trim()
  }

  onPasteClicked = (clipboardContents: string) => {
    this.props.sendTxStore.to = clipboardContents
    // $FlowFixMe
    this.elTo.focus()
  }

  get isToInvalid() {
    const { to } = this.props.sendTxStore
    return to.length && !isValidAddress(to)
  }

  renderAddressErrorMessage() {
    if (this.isToInvalid) {
      return (
        <div className="error input-message">
          <FontAwesomeIcon icon={['far', 'exclamation-circle']} />
          <span>Destination Address is invalid</span>
        </div>
      )
    }
  }

  updateAssetFromSuggestions = ({ asset }: { asset: string }) => {
    const { sendTxStore } = this.props
    sendTxStore.updateAssetFromSuggestions(asset)
  }
  updateAmountDisplay = (amountDisplay: string) => {
    const { sendTxStore } = this.props
    sendTxStore.updateAmountDisplay(amountDisplay)
  }
  renderSuccessResponse() {
    if (this.props.sendTxStore.status !== 'success') {
      return null
    }
    return (
      <FormResponseMessage className="success">
        <span>Transaction sent successfully.</span>
      </FormResponseMessage>
    )
  }

  renderErrorResponse() {
    const { status, errorMessage } = this.props.sendTxStore
    if (status !== 'error') {
      return null
    }
    return (
      <FormResponseMessage className="error">
        <span>There was a problem with sending the transaction.</span>
        <span className="devider" />
        <p>Error message: {errorMessage}</p>
      </FormResponseMessage>
    )
  }

  onSubmitButtonClicked = async () => {
    this.props.sendTxStore.createTransaction()
    // $FlowFixMe
    this.AutoSuggestAssets.wrappedInstance.reset()
  }

  get isAmountValid() {
    const { amount, asset } = this.props.sendTxStore
    return amount && (amount <= this.props.portfolioStore.getBalanceFor(asset))
  }

  get isToValid() {
    const { to } = this.props.sendTxStore
    return (to.length > 0) && isValidAddress(to)
  }

  get areAllFieldsValid() {
    const { asset, to } = this.props.sendTxStore
    return !!(asset && to && this.isAmountValid && this.isToValid)
  }

  get isSubmitButtonDisabled() {
    const { inProgress } = this.props.sendTxStore
    return inProgress || !this.areAllFieldsValid
  }
  render() {
    const {
      portfolioStore,
      sendTxStore: {
        to, asset, amount, amountDisplay, inProgress,
      },
    } = this.props

    return (
      <Layout className="send-tx">
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
                    ref={ref('elTo').bind(this)}
                    name="to"
                    type="text"
                    placeholder="Destination address"
                    className={cx({ 'is-valid': this.isToValid, error: this.isToInvalid })}
                    onChange={this.onToChanged}
                    value={to}
                    autoFocus
                  />
                  <IsValidIcon
                    isValid={isValidAddress(to)}
                    className="input-icon"
                    hasColors
                    isHidden={!to}
                  />
                  {this.renderAddressErrorMessage()}
                </Flexbox>
                  {/* <PasteButton
                  className="button-on-right"
                  onClick={this.onPasteClicked}
                /> */}
              </Flexbox>
            </Flexbox>
            <Flexbox flexDirection="row">
              {/* $FlowIssue */}
              <AutoSuggestAssets
                asset={asset}
                onUpdateParent={this.updateAssetFromSuggestions}
                ref={ref('AutoSuggestAssets').bind(this)}
              />
              <AmountInput
                amount={amount}
                amountDisplay={amountDisplay}
                maxDecimal={isZenAsset(asset) ? ZENP_MAX_DECIMALS : 0}
                minDecimal={isZenAsset(asset) ? ZENP_MIN_DECIMALS : 0}
                maxAmount={asset ? portfolioStore.getBalanceFor(asset) : null}
                shouldShowMaxAmount
                exceedingErrorMessage="Insufficient Funds"
                onAmountDisplayChanged={this.updateAmountDisplay}
                label="Amount"
              />
            </Flexbox>
          </Flexbox>
          <Flexbox flexDirection="row">
            { this.renderSuccessResponse() }
            { this.renderErrorResponse() }
            <Flexbox flexGrow={2} />
            <Flexbox flexGrow={1} justifyContent="flex-end" flexDirection="row">
              <ProtectedButton
                className={cx('button-on-right', { loading: inProgress })}
                disabled={this.isSubmitButtonDisabled}
                onClick={this.onSubmitButtonClicked}
              >
                {inProgress ? 'Sending' : 'Send'}
              </ProtectedButton>
            </Flexbox>
          </Flexbox>
        </Flexbox>
      </Layout>
    )
  }
}

export default SendTx
