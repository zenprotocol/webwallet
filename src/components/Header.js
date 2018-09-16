// @flow

import React, { Component } from 'react'
import { observer } from 'mobx-react'


@observer
class Header extends Component<Props> {
    style(){
        return {
            position: 'fixed',
            right: '0',
            top: 0,
            width: '100%',
            height: 30,
            background: '#77e0fd',
            textAlign: 'center',
            color: 'white',
            paddingTop: 6,
            paddingBottom: 6,
        }
    }
    render() {
        return (
            <div style={this.style()}>
                <p>DON'T GET PHISHED, please!</p>
                <p>1. BOOKMARK WALLET.ZP.IO</p>
            </div>
        )
    }
}

export default Header
