import React from 'react'
import { SiteData } from 'react-static'
import ReactMarkdown from 'react-markdown'

export default () => (
  <SiteData
    render={({footerContent}) => (
      <div
        className="footer-wrap"
        style={{display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', width: '100%', padding: '30px 0px 50px 0px', backgroundColor: '#232323'}}
      >
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
