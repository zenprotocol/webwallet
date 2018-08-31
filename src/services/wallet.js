import { Wallet } from '@zen/zenjs'

import PollManager from '../utils/PollManager'

class _Wallet {
  // used by portfolio store to get balances, might
  // be used by tx history store in the future
  subscribers = []
  instance = null
  subscribe (fn) {
    this.subscribers.push(fn)
  }
  create (mnemonic, chain) {
    // normalize the chain due to inconsistencies of API, sometimes using main, sometimes mainnet
    if (chain.includes('main')) {
      chain = 'main'
    } else if (chain.includes('test')) {
      chain = 'test'
    }
    if (this.instance !== null) {
      global.console.warn('wallet instance already exists')
      return
    }
    this.instance = Wallet.fromMnemonic(
      mnemonic,
      chain,
      new Wallet.RemoteNodeWalletActions('https://remote-node.zp.io')
    )
    this.fetchPollManager.initPolling()
    console.log('wallet created')
    return this.instance
  }
  destroy() {
    this.fetchPollManager.stopPolling()
    this.instance = null
  }

  fetch = async () => {
    if (this.instance === null) {
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
