import React from 'react'
import { Link } from 'react-static'
import DotIcon from '../assets/icons/dot.svg'

export default ({dest, text}) => (
  <Link exact={dest === '/'} to={dest} activeClassName="active-tab">
    <div className="tab" style={{display: 'flex', flexDirection: 'row', marginTop: 10}}>
      <img src={DotIcon} style={{width: 9}} />
      <p style={{paddingLeft: 10}}>
        {text}
      </p>
    </div>
  </Link>
)
