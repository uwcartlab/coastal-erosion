import React from 'react'
import ReactMarkdown from 'react-markdown'

const Controls = ({onBack, onNext, showBack, showNext}) => (
  <div className="controls">
    <div>
      <p style={{fontSize: '1.1rem'}}>
        <strong>
          Photo by Mike Swenson
        </strong>
      </p>
    </div>
    <div>
      {showBack &&
        <p onClick={onBack} style={{fontSize: '1.1rem'}}>
          Back
        </p>
      }
      {showNext &&
        <p onClick={onNext} style={{fontSize: '1.1rem'}}>
          Next
        </p>
      }
    </div>
  </div>
)

const Slide = ({slide, index, activeIndex, onBack, onNext, showBack, showNext}) => {
  let image = require(`../content/${slide.img}`)
  return(
    <div className={["slide", index === activeIndex && "active"].join(" ")}>
      <div className="img-wrap">
        <div
          className="img"
        >
          <img
            src={image}
          />
        </div>

        <Controls
          onBack={onBack}
          onNext={onNext}
          showBack={showBack}
          showNext={showNext}
        />
      </div>

      <div className="text-wrap">
        <ReactMarkdown
          className="caption-text"
          source={slide['text']}
        />

        {slide['definition'] &&
          <ReactMarkdown
            className="definition-text"
            source={slide['definition']}
          />
        }
      </div>
    </div>
  )
}

export default class SlideShow extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeIndex: 0
    }
  }

  onBack() {
    if (this.state.activeIndex === 0) {
      return
    }

    this.setState({
      activeIndex: this.state.activeIndex - 1
    }, () => console.log(this.state))
  }

  onNext() {
    if (this.state.activeIndex === this.props.slides.length - 1) {
      return
    }

    this.setState({
      activeIndex: this.state.activeIndex + 1
    }, () => console.log(this.state))
  }

  render() {
    let {slides, style} = this.props
    let {activeIndex} = this.state

    return(
      <div className="slideshow" style={style || {}}>
        {
          slides.map((s, i) => (
            <Slide
              key={i}
              slide={s}
              index={i}
              activeIndex={activeIndex}
              onBack={this.onBack.bind(this)}
              onNext={this.onNext.bind(this)}
              showBack={activeIndex > 0}
              showNext={activeIndex < slides.length - 1}
            />
          ))
        }
      </div>
    )
  }
}
