import React from 'react'
import { SiteData } from 'react-static'
import ReactMarkdown from 'react-markdown'

export default () => (
  <SiteData
    render={({footerContent}) => (
      <div id="footer-wrap">
        {
          Object.keys(footerContent).map((k) => (
            <div>
              <ReactMarkdown key={k} source={footerContent[k]} />
            </div>
          ))
        }
      </div>
    )}
  />
)
