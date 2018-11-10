import React from 'react'
import { Router, Switch } from 'react-static'
import Routes from 'react-static-routes'
import { hot } from 'react-hot-loader'
import './css/main.css'

import Footer from './components/Footer'
import Jumbotron from './components/Jumbotron'
import Navbar from './components/Navbar'
import Page from './components/Page'
import SideMenu from './components/SideMenu'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      navbarFixed: false
    }
  }

  componentDidMount() {
    if ('undefined' !== typeof window)
      window.addEventListener('scroll', this.onScroll.bind(this))
  }

  componentWillUnmount() {
    if ('undefined' !== typeof window)
      window.removeEventListener('scroll', this.onScroll.bind(this))
  }

  onScroll() {
    if ('undefined' === typeof window)
      return

    var navbar = document.getElementById('navbar')
    var navbarHeight = navbar.getBoundingClientRect().height
    this.navbarHeight = navbarHeight

    var pageWrap = document.getElementById('page-wrap')
    var pageWrapTop = pageWrap.getBoundingClientRect().top

    if (this.state.navbarFixed) {
      if (pageWrapTop > 0) {
        this.setState({ navbarFixed: false }, () => console.log(this.state))
      }
    } else {
      if (pageWrapTop - navbarHeight <= 0) {
        this.setState({ navbarFixed: true }, () => console.log(this.state))
      }
    }
  }

  render() {
    return(
      <Router>
        <div>
          <Jumbotron />
          <Navbar fixed={this.state.navbarFixed} />
          <div id="page-wrap">
            <Page
              style={{
                container: {
                  marginTop: (this.state.navbarFixed) ? this.navbarHeight : 0
                }
              }}
            >
              <Switch>
                <Routes />
              </Switch>
            </Page>
          </div>
          <Footer />
        </div>
      </Router>
    )
  }
}

export default hot(module)(App)
