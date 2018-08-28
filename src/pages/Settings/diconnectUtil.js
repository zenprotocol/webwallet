import swal from 'sweetalert'

import { LS_ENCRYPTED_MNEMONIC_PHRASE_AS_STRING } from '../../stores/secretPhraseStore'
import history from "../../services/history"
import routes from "../../constants/routes"
import wallet from '../../services/wallet'




const disconnect = async () => {
  const shouldDisconnect = await swal({
    title: 'Confirm Disconnect',
    icon: 'warning',
    dangerMode: true,
    buttons: true,
  })
  if (shouldDisconnect) {
      localStorage.removeItem(LS_ENCRYPTED_MNEMONIC_PHRASE_AS_STRING)
      history.push(routes.WELCOME_MESSAGES)
      wallet.destroy()
  }
}

export default disconnect
