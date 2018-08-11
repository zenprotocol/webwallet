// @flow

import * as React from 'react'

type Props = {
  children: React.Node,
};

const ExternalLink = (props: Props) => (
  // TODO check if {...props} is enough to pass the children as well
  <a {...props} target="_blank" rel="nofollow noreferrer noopener">
    {props.children}
  </a>
)

export default ExternalLink
