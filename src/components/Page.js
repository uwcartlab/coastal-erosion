import React from 'react'

export default class extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div
        id="page"
        style={(this.props.style && this.props.style.container) ? this.props.style.container : {}}
      >
        <div>
          {this.props.children}
        </div>
      </div>
    )
  }
}
