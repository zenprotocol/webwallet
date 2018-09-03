import swal from 'sweetalert'

import history from "../../services/history"
import routes from "../../constants/routes"
import wallet from '../../services/wallet'

const wipeLocalStorage = async () => {
  const shouldWipe = await swal({
    title: 'Wipe your seeds',
    text: 'Be sure you have your seed saved.',
    icon: 'warning',
    dangerMode: true,
    buttons: true,
  })
  if (shouldWipe) {
      localStorage.clear()
      wallet.destroy()
      history.push(routes.WELCOME_MESSAGES)
  }
}

export default wipeLocalStorage
