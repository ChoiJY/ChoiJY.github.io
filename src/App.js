import React, { Component } from 'react';
import { BrowserRouter as Router,  Route, Switch } from 'react-router-dom';

import Study from "./js/study/Study"
import AboutMe from "./js/about/AboutMe"
import Profiles from "./js/profile/Profiles";
import Error from "./js/common/Error";
import Portfolio from "./js/portfolio/Portfolio";

import './css/App.css';
import './css/style.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
            <Switch>
                <Route exact path="/" component={Profiles}/>
                <Route exact path="/study" component={Study}/>
                <Route exact path="/portFolio" component={Portfolio}/>
                <Route exact path="/about" component={AboutMe}/>
                <Route component={Error}/>
            </Switch>
            {/*<Footer/>*/}
        </div>
      </Router>
    );
  }
}

export default App;
