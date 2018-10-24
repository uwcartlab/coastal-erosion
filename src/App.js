import React from 'react'
import { Router } from 'react-static'
import Routes from 'react-static-routes'
import { hot } from 'react-hot-loader'
import './css/main.css'

import Footer from './components/Footer'
import Header from './components/Header'
import Page from './components/Page'
import SideMenu from './components/SideMenu'

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <Router onUpdate={() => console.log("blah")}>
        <div>
          <Header />

          <div id="page-wrap">
            <SideMenu />

            <Page>
              <Routes />
            </Page>
          </div>

          <Footer />
        </div>
      </Router>
    )
  }
}

export default hot(module)(App)
