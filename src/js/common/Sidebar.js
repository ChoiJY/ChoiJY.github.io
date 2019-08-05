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
  };

  profileRender(){
    if(window.innerWidth <= 768 ) {
      return <img src={myImage} id="photo_frame" className="collapse rounded photo-frame img-rounded" alt="personalImage"/>
    }
    else{
      return <img src={myImage} id="photo_frame" className="rounded photo-frame img-rounded" alt="personalImage"/>
    }
  };

  render() {
    return (
        <div className="Sidebar">
          {/* personal introuction*/}
          <div className="text-center">
            {/*TODO: this method is temporary*/}
            {this.profileRender()}
            {/*<img src={myImage} id="photo_frame" className="rounded photo-frame img-rounded" alt="personalImage"/>*/}
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