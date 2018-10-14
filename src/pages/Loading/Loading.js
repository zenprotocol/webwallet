import React, { Component } from 'react'
import Flexbox from 'flexbox-react'

import { LOADING_GIF_SRC, LOGO_GIF_SRC } from '../../constants/imgSources'

import load from './loadUtil'

const TIME_TO_DISPLAY_LOADING = 3650

class Loading extends Component {
  state = {
    shouldDisplayLoading: false,
  }

  componentDidMount() {
    if (isMobile()) {
      return
    }
    load()
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
          {isMobile() ? this.renderMobileMsg : this.renderLoadingMsg}
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
        <h1>Welcome to Zen Protocol</h1>
        <p>Loading, please wait</p>
        {shouldDisplayLoading && <img className="loading-dots" src={LOADING_GIF_SRC} alt="Loading Gif" />}
      </div>
    )
  }
}

export default Loading

function isMobile() {
    return (window.innerWidth <= 900 || document.documentElement.clientWidth <= 900
        || document.body.clientWidth  <= 900) && (window.innerHeight <= 600|| document.documentElement.clientHeight <= 600
        || document.body.clientHeight  <= 600)
}
