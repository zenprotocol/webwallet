// @flow
import axios from 'axios'
import compare from 'semver-compare'

import { version } from '../../constants/constants'


export const RELEASE_API_URL = 'https://api.github.com/repos/zenprotocol/webwallet/releases/latest'
export const LATEST_RELEASE_URL = 'https://github.com/zenprotocol/webwallet/releases/latest'

export const checkForUpdates = async (): Promise<?string> => {
  try {
    const response = await axios.get(RELEASE_API_URL)
    const tagVersion = response.data.tag_name.replace('v', '')
    const updateMessage = response.data.body
    if (compare(version, tagVersion) !== -1) {
      version = tagVersion
      return
    }
    return { message: updateMessage }
  } catch (error) {
    console.error(error)
  }
}
