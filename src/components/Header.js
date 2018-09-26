// @flow

import React, { Component } from 'react'
import { observer } from 'mobx-react'
import swal from "sweetalert"

import FontAwesomeIcon from "../vendor/@fortawesome/react-fontawesome"

type State = {
    isVisible?: boolean
};

@observer
class Header extends Component<State> {
    state = {
        isVisible: true,
    }

    shouldSwitchModal() {
        return swal({
            title: 'Did you bookmark this page?',
            icon: 'warning',
            dangerMode: true,
            buttons: true,
        })
    }

    onClick = async () => {
        const shouldSwitch = await this.shouldSwitchModal()
        if(!shouldSwitch){
            return
        }
        this.setState({isVisible: false})
    }

    style() {
        return {
            right: 0,
            top: 0,
            width: '100%',
            height: 30,
            background: '#3a88d9',
            color: 'white',
            paddingTop: 6,
            paddingBottom: 6,
            textAlign: 'center',
        }
    }
    render() {
        return (
            this.state.isVisible && <div style={this.style()}>
                <p>DON'T GET PHISHED, please!</p>
                <p>1. BOOKMARK HTTPS://WALLET.ZP.IO</p>
                <a onClick={this.onClick}>
                    <FontAwesomeIcon style={{  color: '#fff', position: 'fixed', top: '1em', right: '1em' }} icon={['fal', 'times']} />
                </a>
            </div>
        )
    }
}

export default Header
