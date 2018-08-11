import React, { Component } from 'react'
import moment from 'moment'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import cx from 'classnames'

import FontAwesomeIcon from '../../vendor/@fortawesome/react-fontawesome'
import NonMainNetBottomBar from '../../components/NonMainNetBottomBar'
import { ZEN_NODE_VERSION, WALLET_VERSION } from '../../constants/versions'
import { MAINNET } from '../../constants/constants'
import { LOGO_SRC } from '../../constants/imgSources'
import routes from '../../constants/routes'
import NetworkStore from '../../stores/networkStore'
import SecretPhraseStore from '../../stores/secretPhraseStore'

import SidebarMenu from './SidebarMenu'

type Props = {
  className?: string,
  networkStore: NetworkStore,
  secretPhraseStore: SecretPhraseStore
};

@inject('secretPhraseStore', 'networkStore')
@observer
class Sidebar extends Component<Props> {
  static defaultProps = {
    className: '',
  }
  get isBottomBarPresent() {
    return this.props.networkStore.chain !== MAINNET
  }
  get bottomDataClassName() {
    return cx('network-data-point bottom', { 'with-bottom-bar': this.isBottomBarPresent })
  }
  formattedBlockchainTime() {
    const { medianTime } = this.props.networkStore
    return medianTime
      ? moment(new Date(medianTime)).format('DD/MM/YYYY, HH:mm:ss')
      : medianTime
  }

  renderSyncingStatus() {
    const {
      isSynced, isSyncing,
    } = this.props.networkStore

    if (isSyncing) {
      return (
        <div>
          <span className="data-name" title="Syncing">
            <FontAwesomeIcon icon={['far', 'spinner-third']} spin />
          </span>
          <span className="data-point"> Syncing</span>
        </div>
      )
    }

    if (isSynced) {
      return (
        <div>
          <span className="data-name" title="Syncing">
            <FontAwesomeIcon icon={['fas', 'circle']} className="green" />
          </span>
          <span className="data-point"> Synced</span>
        </div>
      )
    }
  }

  renderVersions() {
    return (
      <div className="network-data-point">
        <span className="data-name" title="Wallet Version">Wallet Version: </span>
        <span className="data-point">{WALLET_VERSION}</span>
      </div>
    )
  }

  rednerHashingPower() {
    const { hashrateByUnit, hashrateUnit } = this.props.networkStore
    return (
      <div className="network-data-point truncate">
        <span className="data-name">Network Hashrate: </span>
        <span className="data-point" title={`${hashrateByUnit} ${hashrateUnit}`}>
          {parseFloat(hashrateByUnit).toFixed(2)} {hashrateUnit}
        </span>
      </div>
    )
  }

  renderNetworkStatus() {
    const {
      chain, blocks, headers, difficulty, connectedToNode,
    } = this.props.networkStore

    if (!connectedToNode) {
      return (
        <div className="network-status">
          { this.renderVersions() }
          <div className={this.bottomDataClassName}>
            <span className="data-name">
              <FontAwesomeIcon icon={['fas', 'circle']} className="red" />
            </span>
            <span className="data-point"> Not Connected to a Node</span>
          </div>
        </div>
      )
    }

    return (
      <div className="network-status">
        <div className="network-data-point">
          <span className="data-name">Chain: </span>
          <span className="data-point">{chain}</span>
        </div>
        <div className="network-data-point">
          <span className="data-name">Blocks: </span>
          <span className="data-point">{blocks.toLocaleString()}</span>
        </div>
        <div className="network-data-point">
          <span className="data-name">Headers: </span>
          <span className="data-point">{headers.toLocaleString()}</span>
        </div>
        <div className="network-data-point truncate">
          <span className="data-name">Mining Difficulty: </span>
          <span className="data-point" title={difficulty}>{difficulty}</span>
        </div>
        { this.rednerHashingPower() }
        <div className="network-data-point">
          <span className="data-name" title="Median Time Past">MTP: </span>
          <span className="data-point">{this.formattedBlockchainTime()}</span>
        </div>
        { this.renderVersions() }
        <div className={this.bottomDataClassName}>
          { this.renderSyncingStatus() }
        </div>
      </div>
    )
  }

  render() {
    const SIDEBAR_WIDTH = 230
    return (
      <nav className={`sidebar ${this.props.className}`}>
        <div className="logo">
          <Link to={routes.PORTFOLIO}>
            <img src={LOGO_SRC} alt="Zen Protocol Logo" />
          </Link>
        </div>
        <SidebarMenu />
        {this.renderNetworkStatus()}
        <NonMainNetBottomBar width={SIDEBAR_WIDTH} />
      </nav>
    )
  }
}

export default Sidebar
