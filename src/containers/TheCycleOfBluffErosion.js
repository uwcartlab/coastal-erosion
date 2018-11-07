import React from 'react'
import { RouteData } from 'react-static'
import ReactMarkdown from 'react-markdown'

import CaptionedImage from '../components/CaptionedImage'

import BluffNorthOfMilwaukee from '../assets/images/bluff-north-of-milwaukee.png'

export default () => (
  <RouteData
    render={({content}) => (
      <div style={{display: 'flex'}}>
        <div style={{width: '35%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <ReactMarkdown className="markdown-wrap" source={content.paragraph1.text} />

          <br />

          <CaptionedImage
            fullWidthOnMobile
            img={BluffNorthOfMilwaukee}
            imgW={300}
            imgR={376 / 574}
            caption={content.captionBluffNorthOfMilwaukee.text}
          />

          <br />

          <ReactMarkdown className="markdown-wrap" source={content.paragraph2.text} />
        </div>

        <div style={{width: '65%', height: 650, backgroundColor: 'pink'}}>

        </div>
      </div>
    )}
  />
)
