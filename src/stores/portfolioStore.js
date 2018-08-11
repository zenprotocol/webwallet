import { observable, computed, action, runInAction } from 'mobx'
import { find } from 'lodash'

import wallet from '../services/wallet'
import { zenBalanceDisplay, kalapasToZen, isZenAsset } from '../utils/zenUtils'
import { numberWithCommas } from '../utils/helpers'
import { ZEN_ASSET_NAME, ZEN_ASSET_HASH } from '../constants/constants'

class PortfolioStore {
    @observable rawAssets = []
    @observable searchQuery = ''

    constructor(activeContractsStore) {
      this.activeContractsStore = activeContractsStore
      wallet.subscribe(this.updateBalancesFromWallet)
    }

    @action.bound
    updateBalancesFromWallet = () => {
      const rawAssets = wallet.instance.getBalance()
      console.log(rawAssets)
      runInAction(() => this.rawAssets = rawAssets)
      // if there's a balance without asset name, check ACS if matching contract exists
      // if it does, save it to DB
      // rawAssets.filter(asset => !this.getAssetName(asset.asset))
      //   .forEach(asset => {
      //     const matchingActiveContract =
      //       this.activeContractsStore.activeContracts.find(ac => ac.contractId === asset.asset)
      //     if (matchingActiveContract) {
      //       db.get('savedContracts').push(matchingActiveContract).write()
      //     }
      //   })
    }

    fetch() {
      wallet.fetch()
    }

    getAssetName(asset) {
      if (asset === ZEN_ASSET_HASH) {
        return ZEN_ASSET_NAME
      }
      // TODO
      return ''
    }

    getBalanceFor(asset) {
      const result = find(this.assets, { asset })
      return result ? result.balance : 0
    }

    get assets() {
      return []
      return this.rawAssets.map(asset => ({
        ...asset,
        name: this.getAssetName(asset.asset),
        balance: isZenAsset(asset.asset) ? kalapasToZen(asset.balance) : asset.balance,
        balanceDisplay: isZenAsset(asset.asset)
          ? zenBalanceDisplay(asset.balance)
          : numberWithCommas(asset.balance),
      }))
    }

    filteredBalances = query => {
      if (!this.assets.length) {
        return []
      }
      if (!query) {
        return this.assets
      }
      return this.assets.filter(asset => (asset.name.indexOf(query) > -1)
        || (asset.asset.indexOf(query) > -1))
    }

    @computed
    get zenDisplay() {
      return this.zen ? this.zen.balanceDisplay : '0'
    }
    @computed
    get zenBalance() {
      return this.zen ? this.zen.balance : 0
    }
    @computed
    get zen() {
      return this.assets.find(asset => asset.asset === ZEN_ASSET_HASH)
    }
}

export default PortfolioStore
