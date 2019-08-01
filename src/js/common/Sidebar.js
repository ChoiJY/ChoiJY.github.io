import React, {Component} from 'react';

import Footer from "./Footer";

import '../../css/style.css';
import myImage from "../../img/profile.jpg";

/*
    Sidebar section
 */
class Sidebar extends Component {

  makeActive = () => {

    document.getElementsByClassName('list-group-item-action').className -= 'active';

    let nowUrl = window.location.href;

    if (nowUrl.indexOf('about') >= 0) {
      document.getElementsByClassName('li-about').className += 'active';
    } else if (nowUrl.indexOf() >= 0) {

    } else {
      document.getElementsByClassName('li-profile').className += 'active';
    }
  };

  render() {
    return (
        <div className="Sidebar">
          {/* personal introuction*/}
          <div className="text-center">
            <img src={myImage} className="rounded photo-frame" alt="personalImage"/>
          </div>
          {/* side menu & profile link*/}
          <ul className="list-group list-group-flush">
            <a href="about" className="li-about list-group-item list-group-item-action">About Me</a>
            <a href="/" className="li-profile list-group-item list-group-item-action">Profile</a>
            <a href="portfolio" className="li-portfolio list-group-item list-group-item-action">Portfolio</a>
            <a href="study" className="li-study list-group-item list-group-item-action">Study</a>
          </ul>
          <Footer/>
        </div>
    );
  }
}

export default Sidebar;