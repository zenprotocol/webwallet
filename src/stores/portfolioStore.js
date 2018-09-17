import { observable, computed, action, runInAction } from 'mobx'
import { find } from 'lodash'

import wallet from '../services/wallet'
import { zenBalanceDisplay, kalapasToZen, isZenAsset } from '../utils/zenUtils'
import {getNamefromCodeComment, numberWithCommas} from '../utils/helpers'
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
        const balance = wallet.instance.getBalance()
        const rawAssets = Object.keys(balance).map(key => {
            return {
                asset: key,
                balance: balance[key]
            }
        })
        runInAction(() => this.rawAssets = rawAssets)
    }

    fetch() {
        wallet.fetch()
    }

    getAssetName(asset) {
        if (asset === ZEN_ASSET_HASH) {
            return ZEN_ASSET_NAME
        }

        const contractId = asset.substring(0, 64 + 8) // getting only the contract id, excluding the subType

        const matchingActiveContract = this.activeContractsStore.activeContracts.find(ac => ac.contractId === contractId)
        if (matchingActiveContract) {
            const name = getNamefromCodeComment(matchingActiveContract.code)

            const subType = asset.substring(64+8)

            if (subType) {

                const buffer = Buffer.from(subType, 'hex')

                // is a number candidate?
                if (buffer[0] === 0) {
                    let isNumber = true

                    for (let i=5; i < 32;i++) {
                        if (buffer[i] !== 0) {
                            isNumber = false
                            break
                        }
                    }

                    if (isNumber) {
                        const number = buffer.readInt32BE(1)

                        return `${name} - #${number}`
                    }
                } else {

                    let isZero = false
                    let isStringCandidate = true
                    let stringLength = 0

                    // Check if buffer is padded with zeros up to the end
                    for (let i = 0; i < 32; i++) {
                        if (!isZero && buffer[i] === 0) {
                            isZero = true
                            stringLength = i
                        }
                        else if (isZero && buffer[i] !== 0) {
                            isStringCandidate = false
                            break
                        }
                        else if (!isZero) {
                            stringLength = i
                        }
                    }

                    if (isStringCandidate && stringLength > 0) {
                        const subTypeName = buffer.slice(0, stringLength)

                        if (/^[\x00-\x7F]*$/.test(subTypeName)) {
                            return `${name} - ${subTypeName}`
                        }
                    }
                }
                
                return ''
                
            } else {
                return name
            }

        }
        return ''
    }

    getBalanceFor(asset) {
        const result = find(this.assets, { asset })
        return result ? result.balance : 0
    }

    get assets() {
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