import React, { Component } from 'react'
import Flexbox from 'flexbox-react'
import {isMobileOnly} from 'react-device-detect'
import TransportWebUSB from "@ledgerhq/hw-transport-webusb"


import { LOADING_GIF_SRC, LOGO_GIF_SRC } from '../../constants/imgSources'

//import load from './loadUtil'

const TIME_TO_DISPLAY_LOADING = 3650

class Loading extends Component {
  state = {
    shouldDisplayLoading: false,
    isSupported: false,
    descriptors: []
  }

  async componentDidMount() {
    if (isMobileOnly) {
      return
    }
    const isSupported = await TransportWebUSB.isSupported()

    this.setState({
      isSupported
    })

    if (isSupported) {
      const transport = await TransportWebUSB.create()
      console.log(transport)
      const descriptors = await TransportWebUSB.list()
      console.log(descriptors)

      this.setState({
        descriptors
      })
    }
    //load()
    this.timeout = setTimeout(() => {
      this.setState({ shouldDisplayLoading: true })
    }, TIME_TO_DISPLAY_LOADING)
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  render() {
    return (
      <Flexbox flexDirection="column" className="loading-container">
        <Flexbox flexDirection="column" className="center">
          <img className="zen-logo" src={LOGO_GIF_SRC} alt="Zen Protocol Logo" />
          {isMobileOnly ? this.renderMobileMsg : this.renderLoadingMsg}
        </Flexbox>
      </Flexbox>
    )
  }

  get renderMobileMsg() {
    return <p>Zen web wallet is not supported on mobile. <br />Please use a laptop or desktop computer</p>
  }

  get renderLoadingMsg() {
    const { shouldDisplayLoading } = this.state
    return (
      <div>
        <div className="App">
          <p>{this.state.isSupported ? `yes` : `no`}</p>
          {this.state.isSupported && (
              <p>Descriptors: {this.state.descriptors.length}</p>
          )}
        </div>
        <h1>Welcome to Zen Protocol</h1>
        <p>Loading, please wait</p>
        {shouldDisplayLoading && <img className="loading-dots" src={LOADING_GIF_SRC} alt="Loading Gif" />}
      </div>
    )
  }
}

export default Loading

