// @flow

import * as React from 'react'
import Flexbox from 'flexbox-react'
import cx from 'classnames'
import { Online, Offline } from 'react-detect-offline'

import Container from '../Container'
import Main from '../Main'
import Topbar from '../Topbar'
import Sidebar from '../Sidebar'

type Props = {
  children: React.Node,
  className?: string
};

class Layout extends React.Component<Props> {
  render() {
      return (
          <React.Fragment>
              <Online>
                  <Container className={cx('main', this.props.className)} >
                      <Sidebar title="Zen Protocol" />
                      <Main>
                          {/* $FlowIssue */ }
                          <Topbar />
                          <Flexbox flexDirection="column" flexGrow={1} className="content-container">

                              {this.props.children}
                          </Flexbox>
                      </Main>
                  </Container>
              </Online>
              <Offline>
                  { /* TODO Add page when no internet */}
                  <p> you are not connected to the internet, please connect</p>
              </Offline>
          </ React.Fragment>
      )
  }
}

export default Layout
