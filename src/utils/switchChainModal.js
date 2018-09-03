import swal from 'sweetalert'

import history from '../services/history'
import { networkStore, secretPhraseStore } from '../stores'
import chain from '../services/chain'
import routes from '../constants/routes'

const switchChain = async () => {
  const shouldSwitch = await shouldSwitchModal()
  if (!shouldSwitch) {
    return
  }
  chain.switch()
  secretPhraseStore.reset()
  history.push(routes.LOADING)
}

export default switchChain

function shouldSwitchModal() {
  return swal({
    title: 'Confirm switching chain',
    text: `Switch from ${networkStore.chain}net to ${networkStore.otherChain}net?
    (Continuing will redirect you to the loading screen)`,
    icon: 'warning',
    dangerMode: true,
    buttons: true,
  })
}
