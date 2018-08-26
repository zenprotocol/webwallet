// @flow

import React, { Component } from 'react'
import cx from 'classnames'

import FontAwesomeIcon from '../vendor/@fortawesome/react-fontawesome'

type Props = {
  text?: string,
  className?: string,
  onClick: (clipboardContents: string, evt?: SyntheticEvent<HTMLButtonElement>) => void
};
class PasteButton extends Component<Props> {
  static defaultProps = {
    text: 'Paste',
    className: '',
  }
  onClick = ( evt: SyntheticEvent<HTMLButtonElement>) => {
    navigator.clipboard.readText()
  .then(text => {
    this.props.onClick(text, evt)
  })
  .catch(err => {
    console.error('Failed to read clipboard contents: ', err)
  })
  }
  render() {
    const {
      onClick, className, text, ...remainingProps
    } = this.props
    return (
      <button
        className={cx('button secondary', className)}
        onClick={this.onClick}
        {...remainingProps}
      ><FontAwesomeIcon icon={['far', 'paste']} /> {text}
      </button>
    )
  }
}

export default PasteButton
