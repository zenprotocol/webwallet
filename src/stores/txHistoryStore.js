// @flow
import { observable, action, runInAction } from 'mobx'
import { isEmpty } from 'lodash'

import wallet from '../services/wallet'
import PollManager from '../utils/PollManager'

class TxHistoryStore {
  @observable batchSize = 100
  @observable transactions = []
  @observable skip = 0
  @observable currentPageSize = 0
  @observable isFetching = false
  @observable snapshotBlock
  fetchPollManager = new PollManager({
    name: 'tx history fetch',
    fnToPoll: this.fetch,
    timeoutInterval: 5000,
  })
  constructor(networkStore) {
    this.networkStore = networkStore
  }
  @action
  initPolling() {
    this.fetchPollManager.initPolling()
  }
  @action
  stopPolling() {
    this.fetchPollManager.stopPolling()
  }

  @action
  reset() {
    this.stopPolling()
    runInAction(() => {
      this.skip = 0
      this.currentPageSize = 0
      this.transactions = []
      this.isFetching = false
    })
  }

  @action
  fetchSnapshot = async () => {
    await wallet.fetch()
    const data = await wallet.instance.getTransactions()
    if (isEmpty(data)) return 0
    const final = data
        .filter(x => x.asset === '00')
        .map(({ amount, confirmations }) => ({
          amount,
          blockNumber: this.networkStore.blocks - confirmations,
        }))
        .filter(item => item.blockNumber <= this.snapshotBlock)
        .map(item => item.amount)
    if (isEmpty(final)) return 0
    return final.reduce((total, n) => total + n)
  }


  @action.bound
  fetch = async () => {
    if (this.isFetching) { return }
    this.isFetching = true
    try {
      await wallet.fetch()
      const result = await wallet.instance.getTransactions()
      runInAction(() => {
        if (result.length) {
          this.currentPageSize = result.length
          this.transactions = result
        }
        this.isFetching = false
      })
    } catch (error) {
      console.log('error', error)
      this.isFetching = false
    }
  }
}

export default TxHistoryStore
