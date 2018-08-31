import { observable, action } from 'mobx'
import bip39 from 'bip39'
import { SecurePhrase } from '@zen/zenjs'

import routes from '../constants/routes'
import history from '../services/history'
import wallet from '../services/wallet'
import { isDev } from '../utils/helpers'

const LS_AUTO_LOGOUT_MINUTES = 'autoLogoutMinutes'
export const LS_ENCRYPTED_MNEMONIC_PHRASE_AS_STRING = 'encryptedMnemonicPhraseAsString'

class secretPhraseStore {
  // TODO remove after initial version is up
  // @observable mnemonicPhrase = ["pride", "six", "delay", "awful", "fitness", "sadness", "crush", "school", "tent", "margin", "sweet", "trouble", "avocado", "dove", "liberty", "trumpet", "trick", "neglect", "require", "always", "fringe", "cram", "shadow", "jelly"]
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
    wallet.create(this.mnemonicPhraseAsString, this.networkStore.chain)
    const encryptedMnemonicPhraseAsString = SecurePhrase.encrypt(password, this.mnemonicPhrase)
    localStorage.setItem(LS_ENCRYPTED_MNEMONIC_PHRASE_AS_STRING, encryptedMnemonicPhraseAsString)
    this.mnemonicPhrase = []
    this.isLoggedIn = true
    this.networkStore.initPolling()
    this.activeContractsStore.fetch()
    history.push(routes.TERMS_OF_SERVICE)
  }

  async unlockWallet(password) {
      if (!this.isPasswordCorrect(password)){
          this.status = 'error'
          return
      }

      if (wallet.instance === null) {
          const decryptedMnemonicPhraseAsString = this.decryptMnemonicPhrase(password)
          this.reset()
          wallet.create(decryptedMnemonicPhraseAsString, this.networkStore.chain)
      }
      this.isLoggedIn = true
      this.networkStore.initPolling()
      this.activeContractsStore.fetch()
      if (this.redeemTokensStore.shouldRedeemNonMainnetTokens) {
        history.push(routes.FAUCET)
      } else {
        history.push(routes.PORTFOLIO)
      }
  }

  isPasswordCorrect(password) {
    return !!this.decryptMnemonicPhrase(password)
  }

  decryptMnemonicPhrase(password) {
    try {
      // wrong password throws, so returning false to indicate that
      return SecurePhrase.decrypt(password,localStorage.getItem(LS_ENCRYPTED_MNEMONIC_PHRASE_AS_STRING))
    } catch (err) {
      return false
    }
  }

  get mnemonicPhraseAsString() {
    return this.mnemonicPhrase.join(' ')
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
  resetBasic() {
    this.mnemonicPhrase = []
    this.importError = ''
    this.status = ''
    this.isLoggedIn = false
    this.networkStore.stopPolling()
  }
  @action
  reset() {
    this.resetBasic()
    wallet.fetchPollManager.stopPolling()

  }

  @action
  initDev() {
    this.networkStore.initPolling()
    this.activeContractsStore.fetch()
  }

  get doesWalletExist() {
    return !!localStorage.getItem(LS_ENCRYPTED_MNEMONIC_PHRASE_AS_STRING)
  }

}


export default secretPhraseStore
