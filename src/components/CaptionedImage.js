import React from 'react'
import ReactMarkdown from 'react-markdown'

export default class CaptionedImage extends React.Component {
  state = {
    wh: undefined,
    ww: undefined
  }

  handleResize = () => (typeof window === 'undefined') ? null : this.setState({
    wh: window.innerHeight,
    ww: window.innerWidth
  })

  componentDidMount() {
    this.handleResize()
    if (typeof window !== 'undefined')
      window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined')
      window.removeEventListener('resize', this.handleResize)
  }

  render() {
    let {ww} = this.state
    let {img, imgW, imgR, caption, fullWidthOnMobile} = this.props
    let isFullWidth = ww <= 768 && fullWidthOnMobile

    return(
      <div className="captioned-image" style={{width: (isFullWidth) ? '100vw' : imgW}}>
        <img
          src={img}
          style={{
            width: (isFullWidth) ? '100%' : 'auto',
            height: (isFullWidth) ? 'auto' : imgW * imgR
          }}
        />

        <div
          className="text-wrap"
          style={(isFullWidth)
            ? {
                width: '90%',
                marginLeft: '5%',
                paddingLeft: 0,
                border: 'none'
              }
            : {
                width: '97%',
                marginTop: 10,
                marginLeft: 0,
                paddingLeft: '3%',
                borderLeft: '1px solid #eee'
              }
          }
        >
          <ReactMarkdown className="markdown-wrap caption" source={caption} />
        </div>
      </div>
    )
  }
}
