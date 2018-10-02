// @flow

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import FontAwesomeIcon from '../vendor/@fortawesome/react-fontawesome'
import { MAINNET } from '../services/chain'
import NetworkStore from '../stores/networkStore'
import switchChain from '../utils/switchChainModal'

type Props = {
  networkStore: NetworkStore,
  isSidebar?: boolean,
  width?: number
};

@inject('networkStore')
@observer
class NetBottomBar extends Component<Props> {
  render() {
    const { networkStore } = this.props
    console.log('networkStore.chain', networkStore.chain)
    return networkStore.chain === MAINNET ? this.renderMainnetBar() : this.renderTestnetBar()
  }

  renderMainnetBar() {
    if (this.props.isSidebar) {
      return null
    }
    return (
      <div style={this.style}>
        MAINNET <a style={this.switchStyle} onClick={switchChain}>(Switch to Testnet)</a>
      </div>
    )
  }

  renderTestnetBar() {
    return (
      <div style={this.style}>
        <FontAwesomeIcon style={{ marginRight: 5 }} icon={['fas', 'exclamation-triangle']} />
        TESTNET <a style={this.switchStyle} onClick={switchChain}>(Switch to Mainnet)</a>
      </div>
    )
  }

  get style() {
    const { width, networkStore: { chain } } = this.props
    return {
      position: 'fixed',
      left: 0,
      bottom: 0,
      width: width || '100%',
      background: chain === MAINNET ? 'rgba(18, 18, 18, 0.1)' : '#f68b3d',
      textAlign: 'center',
      color: 'white',
      fontWeight: chain === MAINNET ? 'inherit' : 'bold',
      paddingTop: 6,
      paddingBottom: 6,
    }
  }

  get switchStyle() {
    return {
      fontSize: 10,
      color: 'inherit',
    }
  }
}

export default NetBottomBar
