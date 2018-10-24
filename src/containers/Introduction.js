import React from 'react'
import { RouteData } from 'react-static'
import ReactMarkdown from 'react-markdown'

import CaptionedImage from '../components/CaptionedImage'

import StudyAreaMap from '../assets/images/study-area-map.png'
import ConcordiaUniversity from '../assets/images/concordia-university-aerial.png'

export default () => (
  <RouteData
    render={({content}) => (
      <div id="introduction">
        <div className="introduction-text-wrap">
          <ReactMarkdown
            className="markdown-wrap"
            source={content.paragraph1}
          />

          <div style={{height: 30}} />

          <CaptionedImage
            img={ConcordiaUniversity}
            imgW={280}
            imgR={376 / 574}
            caption={content.captionConcordiaUniversity}
          />
        </div>

        <div style={{width: 30}} />

        <CaptionedImage
          fullWidthOnMobile
          img={StudyAreaMap}
          imgW={220}
          imgR={966 / 466}
          caption={content.captionStudyAreaMap}
        />
      </div>
    )}
  />
)
