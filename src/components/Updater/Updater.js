// @flow
import React from 'react'

import { checkForUpdates } from './Update'
import updateModal from './UpdateModal'

const POLL_INTERVAL = 1000 * 5 * 60
const pollForUpdates = async () => {
  const updateContent = await checkForUpdates()
  if (!updateContent) {
    setTimeout(pollForUpdates, POLL_INTERVAL)
    return
  }
  await updateModal(updateContent.message)
}

class Updater extends React.Component<{}> {
  componentDidMount() {
    pollForUpdates()
  }

  render() {
    return null
  }
}

export default Updater
