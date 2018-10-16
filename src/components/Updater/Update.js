// @flow
import axios from 'axios'
import compare from 'semver-compare'

import {WALLET_VERSION} from "../../constants/versions"

export const RELEASE_API_URL = 'https://api.github.com/repos/zenprotocol/webwallet/releases/latest'
export const LATEST_RELEASE_URL = 'https://github.com/zenprotocol/webwallet/releases/latest'


export const checkForUpdates = async (): Promise<?string> => {
  try {
    const response = await axios.get(RELEASE_API_URL)
    const tagVersion = response.data.tag_name.replace('v', '')
    const updateMessage = response.data.body
    if (compare(WALLET_VERSION, tagVersion) !== -1) {
      return
    }
    return { message: updateMessage }
  } catch (error) {
    console.error(error)
  }
}
