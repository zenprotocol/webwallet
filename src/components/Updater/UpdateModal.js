// @flow
/* eslint-disable react/no-danger */
import React from 'react'
import swal from 'sweetalert'
import ReactDOM from 'react-dom'
import markdownIt from 'markdown-it'

const md = markdownIt({
  linkify: true,
  html: true,
})

function getModalNode(message: string) {
  const wrapper = document.createElement('div')
  ReactDOM.render(<UpdateModal message={message} />, wrapper)
  return wrapper.firstChild
}

const updateModal = (message: string) => swal({
  title: 'A new version of the wallet is available!',
  button: false,
  content: getModalNode(message),
})

type Props = {
  message: string
};

class UpdateModal extends React.Component<Props> {
  onDismiss = () => {
    swal.setActionValue({ cancel: true })
    swal.close()
  }

  onDownload = () => swal.close()

  render() {
    const { message } = this.props
    const msgHTML = { __html: md.render(message) }
    return (
      <div className="update-message">
        <div className="align-left">
          <h2>Release Notes</h2>
          <br />
          <div style={{ marginBottom: 25 }} dangerouslySetInnerHTML={msgHTML} />
        </div>
        <button className="secondary" onClick={this.onDismiss}>Close</button>
        <button className="button-on-right" onClick={this.onDownload}>
        </button>
      </div>
    )
  }
}

export default updateModal
