import PortfolioStore from './portfolioStore'
import PublicAddressStore from './publicAddressStore'
import SendTxStore from './sendTxStore'
import TxHistoryStore from './txHistoryStore'
import ActiveContractsStore from './activeContractsStore'
import NetworkStore from './networkStore'
import SecretPhraseStore from './secretPhraseStore'
import ExecuteContractStore from "./executeContractStore"
import AuthorizedProtocolStore from './authorizedProtocolStore'

export const activeContractsStore = new ActiveContractsStore()
export const portfolioStore = new PortfolioStore(activeContractsStore)
export const publicAddressStore = new PublicAddressStore()
export const networkStore = new NetworkStore()
export const secretPhraseStore =
  new SecretPhraseStore(networkStore, portfolioStore, activeContractsStore)
export const executeContractStore = new ExecuteContractStore(activeContractsStore)
export const sendTxStore = new SendTxStore()
export const txHistoryStore = new TxHistoryStore(networkStore)
export const authorizedProtocolStore = new AuthorizedProtocolStore(publicAddressStore, networkStore, txHistoryStore)
