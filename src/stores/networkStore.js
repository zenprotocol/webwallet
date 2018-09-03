import { observable, action, runInAction, computed } from 'mobx'

import PollManager from '../utils/PollManager'
import { TESTNET, MAINNET } from '../services/chain'
import { getNetworkStatus } from '../services/api-service'
import chain from '../services/chain'

const initialState = getInitialState()

class NetworkStore {
  @observable blocks = initialState.blocks
  @observable headers = initialState.headers
  @observable difficulty = initialState.difficulty
  @observable medianTime = initialState.medianTime
  @observable initialBlockDownload = initialState.initialBlockDownload
  @observable connectedToNode = initialState.connectedToNode
  fetchPollManager = new PollManager({
    name: 'Network fetch',
    fnToPoll: this.fetch,
    timeoutInterval: 2500,
  })

  @action
  initPolling() {
    this.fetchPollManager.initPolling()
  }
  @action
  stopPolling() {
    this.fetchPollManager.stopPolling()
  }

  @action.bound
  async fetch() {
    try {
      const result = this.protectResult(await getNetworkStatus())
      runInAction(() => {
        this.blocks = result.blocks
        this.headers = result.headers
        this.difficulty = result.difficulty
        this.medianTime = result.medianTime
        this.initialBlockDownload = result.initialBlockDownload
        this.connectedToNode = true
      })
    } catch (error) {
      runInAction(() => {
        this.connectedToNode = false
      })
    }
  }

  get isSyncing() {
    return !this.isSynced || (this.blocks < this.headers)
  }

  get isSynced() {
    return !this.initialBlockDownload
  }

  protectResult(result) {
    this.expectedNonUndefinedKeys.forEach(key => {
      if (result[key] === undefined) {
        console.warn(`network response is undefined for key - ${key}. This is unexpected. Falling back to default value ${initialState[key]}`)
        result[key] = initialState[key]
      }
    })
    return result
  }
  @computed
  get expectedNonUndefinedKeys() {
    return ['blocks', 'chain', 'difficulty', 'headers', 'initialBlockDownload', 'medianTime', 'tip']
  }
  get otherChain() {
    return this.chain === TESTNET ? MAINNET : TESTNET
  }

  @computed
  get gigaHashRate() {
    return this.difficulty / 55
  }

  @computed
  get hashrateByUnit() {
    if (this.gigaHashRate < 1) {
      return this.gigaHashRate * 1000
    } else if (this.gigaHashRate > 1000) {
      return this.gigaHashRate / 1000
    }
    return this.gigaHashRate
  }

  @computed
  get hashrateUnit() {
    if (this.gigaHashRate < 1) {
      return 'MH/s'
    } else if (this.gigaHashRate > 1000) {
      return 'TH/s'
    }
    return 'GH/s'
  }

  get chain() {
    return chain.current
  }
}

export default NetworkStore

function getInitialState() {
  return {
    blocks: 0,
    headers: 0,
    difficulty: 0,
    medianTime: 0,
    initialBlockDownload: false,
    connectedToNode: false,
  }
}
