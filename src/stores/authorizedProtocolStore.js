// @flow
import { observable, action, runInAction } from 'mobx'
import { isEmpty } from 'lodash'

import { getContractHistory } from '../services/api-service'
import {MAINNET} from "../services/chain"
import wallet from "../services/wallet"

class AuthorizedProtocolStore {
  @observable inprogress = false
  @observable commit = ''
  @observable interval = 1
  @observable status = ''
  @observable errorMessage = ''
  @observable snapshotBalance = 0
  @observable contractId = this.networkStore.chain === MAINNET ?
    'czen1qqqqqqq8rzylch7w03dmym9zad7vuvs4akp5azdaa6hm7gnc7wk287k9qgs7409ea' :
    'ctzn1qqqqqqq8rzylch7w03dmym9zad7vuvs4akp5azdaa6hm7gnc7wk287k9qgssqskgv'


  constructor(publicAddressStore, networkStore, txHistoryStore) {
    this.publicAddressStore = publicAddressStore
    this.networkStore = networkStore
    this.txHistoryStore = txHistoryStore
  }

  async getSnapshotBalance() {
    this.snapshotBalance = await this.txHistoryStore.fetchSnapshot()
  }

  @action
  async getVote() {
    await this.txHistoryStore.fetch()
    const internalTx = this.txHistoryStore.transactions.map(t => t.txHash)
    const transactions = await getContractHistory(this.networkStore.chain, '00000000e3113f8bf9cf8b764d945d6f99c642bdb069d137bdd5f7e44f1e75947f58a044', 0, 10000000)
    if (isEmpty(this.txHistoryStore.transactions)) return false
    const tx = transactions
        .filter(t => this.networkStore.headers - t.confirmations
            >= Number(this.txHistoryStore.snapshotBlock))
        .map(t => t.txHash)
        .filter(e => internalTx.includes(e))
    if (tx) {
      const voteCommand = transactions.filter(t => t.txHash === tx[0])[0]
      this.votedCommit = !voteCommand ? this.commit : voteCommand.command
    }
    return !isEmpty(tx)
  }

  @action
  async signMessage(message: Buffer, path: Wallet.Path) {
    try {
      this.inprogress = true
      const response = wallet.instance.signMessage(message, path)
      runInAction(() => {
        this.status = 'success'
        setTimeout(() => {
          this.status = ''
        }, 15000)
      })
      this.inprogress = false
      return response
    } catch (error) {
      console.log(error)
    }
  }

  @action
  updateIntervalDisplay(interval) {
    this.interval = interval
  }

  @action
  updateCommitDisplay(commit) {
    this.commit = commit
  }

  @action
  updateContractIdDisplay(contractId) {
    this.contractId = contractId
  }
}

export default AuthorizedProtocolStore
