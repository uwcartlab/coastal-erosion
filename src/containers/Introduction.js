import React from 'react'
import { RouteData } from 'react-static'
import ReactMarkdown from 'react-markdown'

import CaptionedImage from '../components/CaptionedImage'
import SlideShow from '../components/SlideShow'

import StudyAreaMap from '../assets/images/study-area-map.png'
import ConcordiaUniversity from '../assets/images/concordia-university-aerial.png'

export default () => (
  <RouteData
    render={({content, slideshow}) => {
      let slides = Object
        .keys(slideshow)
        .filter((k) => k !== "undefined")
        .map((k) => slideshow[k])

      return(
        <div id="introduction">
          <ReactMarkdown
            className="markdown-wrap"
            source={content.paragraph1.text}
          />

          <CaptionedImage
            fullWidthOnMobile
            noBorder
            img={StudyAreaMap}
            imgW={220}
            imgR={966 / 466}
            caption={content.captionStudyAreaMap.text}
          />

          { /*
          <CaptionedImage
            img={ConcordiaUniversity}
            imgW={280}
            imgR={376 / 574}
            caption={content.captionConcordiaUniversity.text}
            style={{marginTop: 30}}
          />
          */ }

          <SlideShow
            style={{marginTop: 15}}
            slides={slides}
          />
        </div>
      )
    }}
  />
)
