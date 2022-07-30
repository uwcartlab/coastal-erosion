import React from 'react'
import { SiteData, Link } from 'react-static'
import Tab from './Tab'

export default class extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <SiteData
        render={({tabs}) => {
          let currRoute = (typeof window === 'undefined')
            ? null
            : tabs.filter((d) => d.dest === window.location.pathname)[0]
          let prevRoute = (tabs.indexOf(currRoute) === 0)
            ? null
            : tabs[tabs.indexOf(currRoute) - 1]
          let nextRoute = (tabs.indexOf(currRoute) === tabs.length - 1)
            ? null
            : tabs[tabs.indexOf(currRoute) + 1]

          return(
            <div
              id="navbar"
              className={(this.props.fixed) ? 'fixed' : ''}
            >
              <div>
                {
                  (prevRoute)
                    ? <Link exact={prevRoute.dest === '/'} to={prevRoute.dest}>
                        <p>Back</p>
                      </Link>
                    : <p>{" "}</p>
                }
              </div>

              <div>
                <p>
                  {
                    (currRoute.text.includes(')'))
                      ? currRoute.text.split(')')[1]
                      : currRoute.text
                  }
                </p>
              </div>

              <div>
                {
                  (nextRoute)
                    ? <Link to={nextRoute.dest}>
                        <p>Next</p>
                      </Link>
                    : <p>{" "}</p>
                }
              </div>
            </div>
          )
        }}
      />
    )
  }
}
