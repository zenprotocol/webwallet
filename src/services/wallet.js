import { Wallet } from '@zen/zenjs'

import PollManager from '../utils/PollManager'
import routes from "../constants/routes"

import history from "./history"
import chain, { MAINNET } from './chain'


class _Wallet {
  // used by portfolio store to get balances, might
  // be used by tx history store in the future
  subscribers = []
  subscribe (fn) {
    this.subscribers.push(fn)
  }
  create (mnemonic) {
    if (this.instance !== null) {
      global.console.warn('wallet instance already exists')
      return
    }
    this.instance = Wallet.fromMnemonic(
      mnemonic,
      chain.current,
      new Wallet.RemoteNodeWalletActions(chain.current === MAINNET ? 'https://remote-node.zp.io' : 'https://testnet-remote-node.zp.io')
    )
    this.fetchPollManager.initPolling()
    return this.instance
  }
  destroy() {
    this.fetchPollManager.stopPolling()
    this.instance = null
  }
  instance = null
  fetch = async () => {
    if (this.instance === null) {
      history.push(routes.LOADING)
      global.console.warn('create a wallet instance before calling fetch')
      return
    }
    await this.instance.refresh()
    this.subscribers.forEach(fn => fn())
  }
  fetchPollManager = new PollManager({
    name: 'wallet fetch',
    fnToPoll: this.fetch,
    timeoutInterval: 3000,
  })
}

const wallet = new _Wallet()

export default wallet
