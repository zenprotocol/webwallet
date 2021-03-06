// @flow

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import cx from 'classnames'
import Flexbox from 'flexbox-react'

import PortfolioStore from '../../stores/portfolioStore'

type Props = {
    portfolioStore: PortfolioStore,
    className?: string
};

@inject('portfolioStore')
@observer
class TopBar extends Component<Props> {
    render() {
        const { portfolioStore, className } = this.props
        return (
            <Flexbox className={cx('header', className)} element="header" >
                <Flexbox flexGrow={1} />
                <div className="balance">
                    <div className="balance-and-ticker">
                        <span className="total-balance">Balance</span>
                        <span className="zen-symbol">ZP</span>
                    </div>
                    <div className="account-balance">{portfolioStore.zenDisplay}</div>
                </div>
            </Flexbox>
        )
    }
}

export default TopBar
