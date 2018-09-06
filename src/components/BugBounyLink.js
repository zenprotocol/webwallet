// @flow
import * as React from 'react'

import { BUG_BOUNTY_URL } from '../constants/constants'

type Props = {
  children?: React.Node
};

const BugBounyLink = ({ children, ...remainingProps }: Props) => (
  <a target='_blank' rel='noreferrer noopener' href={BUG_BOUNTY_URL} {...remainingProps}>
    {children}
  </a>
)

BugBounyLink.defaultProps = {
  children: BUG_BOUNTY_URL,
}

export default BugBounyLink
