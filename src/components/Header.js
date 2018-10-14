// @flow

import React, { Component } from 'react'
import { observer } from 'mobx-react'
import swal from "sweetalert"
import {isMobileOnly} from 'react-device-detect'

import FontAwesomeIcon from "../vendor/@fortawesome/react-fontawesome"

type State = {
    isVisible?: boolean
};

const LS_VISIBLE = 'barVisibility'

@observer
class Header extends Component<Props,State> {
    state = {
        isVisible: isMobileOnly ? false : !this.lsVisibleExists()
    }

    lsVisibleExists(){
        return !!localStorage.getItem(LS_VISIBLE)
    }

    shouldSwitchModal() {
        return swal({
            title: 'Did you bookmark this page?',
            icon: 'warning',
            dangerMode: true,
            button: true
        })
    }

    onClick = async () => {
        const shouldSwitch = await this.shouldSwitchModal()
        if(!shouldSwitch){
            return
        }
        this.setState({isVisible: false})
        localStorage.setItem(LS_VISIBLE, this.state.isVisible)
    }

    style() {
        return {
            right: 0,
            top: 0,
            width: '100%',
            height: 30,
            background: '#f63d3d',
            color: 'white',
            paddingTop: 6,
            paddingBottom: 6,
            textAlign: 'center',

        }
    }


    render() {
        return (
            this.state.isVisible && <div style={this.style()}>
                <p>Beware of <a href="https://en.wikipedia.org/wiki/Phishing" style={{ color: 'white' }} target="_blank"  rel="noopener noreferrer">PHISHING</a> Sites</p>
                <p>Please bookmark this site and make sure you are visiting the correct domain when using the wallet</p>
                <a onClick={this.onClick}>
                    <FontAwesomeIcon style={{  color: '#fff', position: 'fixed', top: '1em', right: '1em' }} icon={['fal', 'times']} />
                </a>
            </div>
        )
    }
}

export default Header
