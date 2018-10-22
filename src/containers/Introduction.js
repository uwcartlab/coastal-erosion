import React from 'react'
import { RouteData } from 'react-static'
import ReactMarkdown from 'react-markdown'

export default () => (
  <RouteData
    render={({text}) => (
      <div className="side-menu-wrap">
        <ReactMarkdown className="markdown-wrap" source={text} />
      </div>
    )}
  />
)
