import { observable, action, runInAction } from 'mobx'

import wallet from '../services/wallet'
import { zenToKalapas, isZenAsset } from '../utils/zenUtils'

class SendTxStore {
  @observable asset = ''
  @observable to = ''
  @observable amountDisplay = ''
  @observable status = ''
  @observable inprogress = false
  @observable errorMessage = ''

  @action
  async createTransaction(password) {
    this.inprogress = true
    try {
      const response = await wallet.send([{
        address: this.to,
        asset: this.asset,
        amount: isZenAsset(this.asset) ? zenToKalapas(this.amount) : this.amount,
      }])

      runInAction(() => {
        console.log('createTransaction response', response)
        this.resetForm()
        this.status = 'success'
        setTimeout(() => {
          this.status = ''
        }, 15000)
      })
    } catch (error) {
      runInAction(() => {
        console.error('createTransaction error', error, error.response)
        this.errorMessage = error.response.data
      })
      this.inprogress = false
      this.status = 'error'
      setTimeout(() => {
        this.status = ''
      }, 15000)
    }
  }

  @action
  updateAsset({ asset }) {
    this.asset = asset
  }

  @action
  updateAssetFromSuggestions(asset) {
    this.asset = asset
    this.amountDisplay = ''
  }

  @action
  updateAmountDisplay(amountDisplay) {
    this.amountDisplay = amountDisplay
  }

  @action
  resetForm() {
    this.inprogress = false
    this.asset = ''
    this.assetName = ''
    this.to = ''
    this.amountDisplay = ''
    this.status = ''
    this.errorMessage = ''
  }

  get amount() {
    return Number(this.amountDisplay)
  }
}

export default SendTxStore
