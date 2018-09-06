// @flow
import React, { type Node } from 'react'
import { observer } from 'mobx-react'

import confirmPasswordModal from '../../services/confirmPasswordModal'


type Props = {
  children: Node,
  onClick: (string, ?SyntheticEvent<HTMLButtonElement>) => void
};

@observer
class ProtectedButton extends React.Component<Props> {
  onClick = async (evt: SyntheticEvent<HTMLButtonElement>) => {
    const confirmedPassword = await confirmPasswordModal()
    if (!confirmedPassword) {
      return
    }
    this.props.onClick(confirmedPassword, evt)
  }

  render() {
    const {
      children, ...remainingProps
    } = this.props
    return (
      <button {...remainingProps} onClick={this.onClick}>
        {children}
      </button>
    )
  }
}

export default ProtectedButton
