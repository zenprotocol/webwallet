import PortfolioStore from './portfolioStore'
import PublicAddressStore from './publicAddressStore'
import SendTxStore from './sendTxStore'
import TxHistoryStore from './txHistoryStore'
import ActiveContractsStore from './activeContractsStore'
import NetworkStore from './networkStore'
import RedeemTokensStore from './redeemTokensStore'
import SecretPhraseStore from './secretPhraseStore'
import ExecuteContractStore from "./executeContractStore"

export const activeContractsStore = new ActiveContractsStore()
export const portfolioStore = new PortfolioStore(activeContractsStore)
export const publicAddressStore = new PublicAddressStore()
export const networkStore = new NetworkStore()
export const redeemTokensStore = new RedeemTokensStore(networkStore)
export const secretPhraseStore =
  new SecretPhraseStore(networkStore, portfolioStore, activeContractsStore, redeemTokensStore)
export const executeContractStore = new ExecuteContractStore(activeContractsStore)
export const sendTxStore = new SendTxStore()
export const txHistoryStore = new TxHistoryStore(networkStore)
