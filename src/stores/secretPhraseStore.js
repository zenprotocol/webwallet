import { observable, action } from 'mobx'
import bip39 from 'bip39'
import { SecurePhrase } from '@zen/zenjs'

import routes from '../constants/routes'
import history from '../services/history'
import chain, { MAINNET } from '../services/chain'
import wallet from '../services/wallet'
import { isDev } from '../utils/helpers'

const LS_AUTO_LOGOUT_MINUTES = 'lsAutoLogoutMinutes'
const LS_TESTNET_SEED = 'lsTestnetSeed'
const LS_MAINNET_SEED = 'lsMainnetSeed'

class secretPhraseStore {
  @observable mnemonicPhrase = []
  @observable isLoggedIn = false
  @observable autoLogoutMinutes = Number(localStorage.getItem(LS_AUTO_LOGOUT_MINUTES)) || 15
  @observable inProgress = false
  @observable isImporting = false
  @observable importError = ''
  @observable status = ''

  constructor(networkStore, portfolioStore, activeContractsStore, redeemTokensStore) {
    this.networkStore = networkStore
    this.portfolioStore = portfolioStore
    this.activeContractsStore = activeContractsStore
    this.redeemTokensStore = redeemTokensStore
    if (isDev()) {
      this.initDev()
    }
  }

  @action.bound
  generateSeed() {
    this.mnemonicPhrase = bip39.generateMnemonic(256).split(' ')
  }

  @action
  setMnemonicToImport(userInputWords) {
    this.mnemonicPhrase = userInputWords
    history.push(routes.SET_PASSWORD)
  }

  @action
  async importWallet(password) {
    wallet.create(this.mnemonicPhraseAsString)
    const encryptedMnemonicPhraseAsString = SecurePhrase.encrypt(password, this.mnemonicPhraseAsString)
    localStorage.setItem(this.lsSeedKey, encryptedMnemonicPhraseAsString)
    this.mnemonicPhrase = []
    this.isLoggedIn = true
    this.networkStore.initPolling()
    this.activeContractsStore.fetch()
    history.push(routes.TERMS_OF_SERVICE)
    return
  }
  
  @action
  async unlockWallet(password) {
    if (!this.isPasswordCorrect(password)) {
      this.status = 'error'
      return
    }
    const decryptedMnemonicPhraseAsString = this.decryptMnemonicPhrase(password)
    if (!decryptedMnemonicPhraseAsString) {
        this.status = 'error'
        return
    }
    wallet.create(decryptedMnemonicPhraseAsString)
    this.isLoggedIn = true
    this.networkStore.initPolling()
    this.activeContractsStore.fetch()
    if (this.redeemTokensStore.shouldRedeemNonMainnetTokens) {
      history.push(routes.FAUCET)
    } else {
      history.push(routes.PORTFOLIO)
    }
  }

  @action async unlockWalletInIframe(password) {
    const decryptedMnemonicPhraseAsString = this.decryptMnemonicPhrase(password)
    wallet.create(decryptedMnemonicPhraseAsString)
  }

  isPasswordCorrect(password) {
     return !!this.decryptMnemonicPhrase(password)
  }

  get mnemonicPhraseAsString() {
    return this.mnemonicPhrase.join(' ')
  }

  decryptMnemonicPhrase(password) {
      try {
          // wrong password throws, so returning false to indicate that
          return SecurePhrase.decrypt(password, localStorage.getItem(this.lsSeedKey)).toString()
      } catch (err) {
          return false
      }
  }
  @action
      unlockWalletClearForm() {
          this.status = ''
      }
  @action
  setAutoLogoutMinutes(minutes) {
    minutes = Number(minutes)
    if (minutes < 1) { minutes = 1 }
    if (minutes > 120) { minutes = 120 }
    this.autoLogoutMinutes = minutes
    localStorage.setItem(LS_AUTO_LOGOUT_MINUTES, minutes)
  }

  @action
  logout() {
    this.reset()
    history.push(routes.UNLOCK_WALLET)
  }

  @action
  reset() {
    this.mnemonicPhrase = []
    this.importError = ''
    this.status = ''
    this.isLoggedIn = false
    wallet.destroy()
    this.networkStore.stopPolling()
  }

  @action
  initDev() {
    this.networkStore.initPolling()
    this.activeContractsStore.fetch()
  }

  get doesWalletExist() {
    return !!localStorage.getItem(this.lsSeedKey)
  }

  get lsSeedKey() {
    return chain.current === MAINNET ? LS_MAINNET_SEED : LS_TESTNET_SEED
  }
}

export default secretPhraseStore
