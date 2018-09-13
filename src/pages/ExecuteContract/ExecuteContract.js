import React, { Component } from 'react'
import Flexbox from 'flexbox-react'
import { inject, observer } from 'mobx-react'
import Checkbox from 'rc-checkbox'

import ActiveContractsStore from '../../stores/activeContractsStore'
import ExecuteContractStore from '../../stores/executeContractStore'
import PortfolioStore from '../../stores/portfolioStore'
import { isZenAsset } from '../../utils/zenUtils'
import Layout from '../../components/Layout'
import ProtectedButton from '../../components/ProtectedButton'
import ResetButton from '../../components/ResetButton'
import AutoSuggestAssets from '../../components/AutoSuggestAssets'
import AutoSuggestActiveContracts from '../../components/AutoSuggestActiveContracts'
import FormResponseMessage from '../../components/FormResponseMessage'
import AmountInput from '../../components/AmountInput'
import { ZENP_MAX_DECIMALS, ZENP_MIN_DECIMALS } from '../../constants/constants'

type Props = {
  activeContractsStore: ActiveContractsStore,
  executeContractStore: ExecuteContractStore,
  portfolioStore: PortfolioStore
};

@inject('activeContractsStore', 'portfolioStore', 'executeContractStore')
@observer
class ExecuteContract extends Component<Props> {
  componentWillUnmount() {
    const { executeContractStore } = this.props
    if (executeContractStore.status.match(/success|error/)) {
      executeContractStore.resetForm()
    }
  }

  onMessageBodyChanged = (evt) => {
    const { executeContractStore } = this.props
    executeContractStore.updateMessageBody(evt.target.value)
  }

  onCommandChanged = (evt) => {
    const { executeContractStore } = this.props
    executeContractStore.command = evt.target.value.trim()
  }

  onExecuteContractClicked = async (confirmedPassword) => {
    const { executeContractStore } = this.props
    await executeContractStore.run(confirmedPassword)
    if (executeContractStore.status !== 'error') {
      this.resetHack()
    }
  }

  // TODO [AdGo] 18/07/2018 - manage these components state by passing props,
  // probably by getDerivedStateFromProps https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops
  resetHack() {
    this.AutoSuggestAssets.wrappedInstance.reset()
    this.AutoSuggestActiveContracts.reset()
  }
  // TODO [AdGo] 18/07/2018 - call executeContractStore.resetForm() from button directly
  // after refactoring resetHack
  reset = () => {
    this.props.executeContractStore.resetForm()
    this.resetHack()
  }

  renderSuccessResponse() {
    const { executeContractStore } = this.props
    if (executeContractStore.status !== 'success') {
      return null
    }
    return (
      <FormResponseMessage className="success">
        <span>Contract has been run successfully</span>
      </FormResponseMessage>
    )
  }

  renderErrorResponse() {
    const { executeContractStore } = this.props
    if (executeContractStore.status !== 'error') {
      return null
    }
    return (
      <FormResponseMessage className="error">
        <span>
          Couldn&apos;t run the contract with the parameters you entered.
        </span>
        <div className="devider" />
        <p>Error message: {executeContractStore.errorMessage}</p>
      </FormResponseMessage>
    )
  }

  // HELPER METHODS FOR CONTRACT ADDRESS AUTO SUGGGEST //
  updateContractAddressFromSuggestions = ({ address }) => {
    const { executeContractStore } = this.props
    executeContractStore.updateAddress(address)
  }

  // HELPER METHODS FOR ASSET AUTO SUGGGEST //
  updateAssetFromSuggestions = ({ asset }) => {
    const { executeContractStore } = this.props
    executeContractStore.asset = asset
    executeContractStore.updateAmountDisplay('')
  }

  get isAmountValid() {
    const { amount, asset } = this.props.executeContractStore
    return !asset || amount <= this.props.portfolioStore.getBalanceFor(asset)
  }

  updateAmountDisplay = (amountDisplay) => {
    const { executeContractStore } = this.props
    executeContractStore.updateAmountDisplay(amountDisplay)
  }

  get isFormValid() {
    const { executeContractStore } = this.props
    return !!executeContractStore.address && !executeContractStore.messageBodyError && this.isAmountValid
  }

  isSubmitButtonDisabled() {
    const { executeContractStore } = this.props
    return executeContractStore.inprogress || !this.isFormValid
  }

  render() {
    const {
      command, amount, asset, inprogress, messageBody, address, amountDisplay, messageBodyError,
      returnAddress, toggleReturnAddress,
    } = this.props.executeContractStore
    const { activeContracts } = this.props.activeContractsStore
    return (
      <Layout className="run-contract">
        <Flexbox flexDirection="column" className="send-tx-container">
          <Flexbox flexDirection="column" className="page-title">
            <h1>Run Contract</h1>
            <h3>
              A contract must be in the <span className="bold">Active Contract Set</span>{' '}
              in order to run it.
            </h3>
          </Flexbox>
          <Flexbox flexDirection="column" className="form-container">
            <AutoSuggestActiveContracts
              activeContracts={activeContracts}
              initialSuggestionInputValue={address}
              onUpdateParent={this.updateContractAddressFromSuggestions}
              ref={(el) => { this.AutoSuggestActiveContracts = el }}
            />
            <Flexbox flexDirection="column" className="choose-command form-row">
              <label htmlFor="command">Choose command</label>
              <Flexbox flexDirection="row" className="command-input">
                <input
                  id="command"
                  className="full-width"
                  name="command"
                  type="text"
                  placeholder="Enter Command"
                  value={command}
                  onChange={this.onCommandChanged}
                />
              </Flexbox>
            </Flexbox>
            <Flexbox flexDirection="row" className="contract-message-details form-row">
              <AutoSuggestAssets
                asset={asset}
                onUpdateParent={this.updateAssetFromSuggestions}
                ref={(el) => { this.AutoSuggestAssets = el }}
              />
              <AmountInput
                amount={amount}
                amountDisplay={amountDisplay}
                maxDecimal={isZenAsset(asset) ? ZENP_MAX_DECIMALS : 0}
                minDecimal={isZenAsset(asset) ? ZENP_MIN_DECIMALS : 0}
                maxAmount={asset ? this.props.portfolioStore.getBalanceFor(asset) : null}
                shouldShowMaxAmount
                exceedingErrorMessage="Insufficient Funds"
                onAmountDisplayChanged={this.updateAmountDisplay}
                label="Amount"
              />
            </Flexbox>
            <Flexbox flexDirection="column" className="message-body">
              <label htmlFor="messageBody">Body</label>
              <textarea
                rows="4"
                cols="50"
                id="messageBody"
                name="messageBody"
                type="text"
                placeholder="Paste message body here"
                value={messageBody}
                onChange={this.onMessageBodyChanged}
              />
              {messageBodyError && <div className="error-msg">{messageBodyError}</div>}
              <label className="checkbox">
                <Checkbox type="checkbox" checked={returnAddress} onChange={toggleReturnAddress} />
                <span className="checkbox-text">
                &nbsp; Include return address
                </span>
              </label>
            </Flexbox>
          </Flexbox>
          <Flexbox flexDirection="row">
            { this.renderSuccessResponse() }
            { this.renderErrorResponse() }
            <Flexbox flexGrow={2} />
            <Flexbox flexGrow={1} justifyContent="flex-end" flexDirection="row">
              <ResetButton onClick={this.reset} />
              <ProtectedButton
                className="button-on-right"
                disabled={this.isSubmitButtonDisabled()}
                onClick={this.onExecuteContractClicked}
              >
                {inprogress ? 'Running' : 'Run'}
              </ProtectedButton>
            </Flexbox>
          </Flexbox>
        </Flexbox>
      </Layout>
    )
  }
}

export default ExecuteContract
