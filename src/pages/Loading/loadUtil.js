import history from '../../services/history'
import routes from '../../constants/routes'
import { networkStore, secretPhraseStore } from '../../stores'

const load = async () => {
  try {
    networkStore.fetch()
  } catch (error) {
    const errMsg = (error && error.response) ? error.response : error
    console.error('error loading wallet', errMsg)
  }
  if (secretPhraseStore.doesWalletExist) {
    history.push(routes.UNLOCK_WALLET)
  } else {
    history.push(routes.WELCOME_MESSAGES)
  }
}

export default load
