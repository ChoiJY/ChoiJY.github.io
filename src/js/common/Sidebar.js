import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';

import Footer from "./Footer";

import '../../css/style.css';
import myImage from "../../img/profile.jpg";

/*
    Sidebar section
 */
class Sidebar extends Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
        <div className="Sidebar">
          {/* personal introuction*/}
          <div className="text-center">
            <img src={myImage} className="rounded photo-frame" alt="personalImage"/>
          </div>
          {/* side menu & profile link*/}
          <ul className="list-group list-group-flush">
            {/*<a href="about" id={"li-about"} className="list-group-item list-group-item-action">About Me</a>*/}
            <li><NavLink exact to="/" className="list-group-item list-group-item-action" activeClassName="active">Profile</NavLink></li>
            <li><NavLink exact to="/portfolio" className="list-group-item list-group-item-action" activeClassName="active">Portfolio</NavLink></li>
            <li><NavLink exact to="/study" className="list-group-item list-group-item-action" activeClassName="active">Study</NavLink></li>
          </ul>
          <Footer/>
        </div>
    );
  }
}

export default Sidebar;