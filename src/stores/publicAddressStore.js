import { observable, action, runInAction } from 'mobx'

import wallet from '../services/wallet'

class PublicAddressStore {
    @observable address = ''
    @observable addressError = ''
    @observable showingPkHash = false
    @observable pkHash = ''

    @action
    async fetch() {
      try {
        await wallet.fetch()
        runInAction(() => {
          this.address = wallet.instance.getAddress()
          this.pkHash = wallet.instance.getPublicKeyHash().hash
          this.addressError = ''
        })
      } catch (err) {
        console.error('error getting public address', err)
        runInAction(() => { this.addressError = 'Error getting public address' })
      }
    }

    @action
    toggleShowPkHash = () => {
      this.showingPkHash = !this.showingPkHash
    }
}

export default PublicAddressStore
