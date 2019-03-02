import React, {Component} from 'react';

import Footer from "./Footer";

import '../../css/style.css';
import myImage from "../../img/default.jpeg";

/*
    Sidebar section
 */
class Sidebar extends Component {
    render() {
        return (
            <div className="Sidebar">
                {/* personal introuction*/}
                <div>
                    <img src={myImage} className="photo-frame" alt="personalImage"></img>
                </div>
                {/* side menu & profile link*/}
                <ul className="list-group list-group-flush">
                    <a href="about" className="list-group-item list-group-item-action">About Me</a>
                    <a href="/" className="list-group-item list-group-item-action">Profile</a>
                    <a href="portfolio" className="list-group-item list-group-item-action">Portfolio</a>
                    <a href="study" className="list-group-item list-group-item-action">Study</a>
                </ul>
                <Footer/>
            </div>
        );
    }
}

export default Sidebar;