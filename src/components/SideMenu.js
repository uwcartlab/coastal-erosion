import React from 'react'
import { SiteData } from 'react-static'
import Tab from './Tab'

export default () => (
  <SiteData
    render={({tabs}) => (
      <div id="side-menu">
        {
          tabs.map((d) => <Tab key={Math.random()} {...d} />)
        }
      </div>
    )}
  />
)
